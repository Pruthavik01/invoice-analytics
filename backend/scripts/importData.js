// scripts/importData.js
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Invoice = require('../models/Invoice');
const Vendor = require('../models/Vendor');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


function safeNumber(v, fallback = 0) {
    if (v === null || v === undefined || v === '') return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

function parseDate(v) {
    if (!v) return null;
    // v might be "2025-11-04" or an object like { "$date": "2025-11-04T..." }
    if (typeof v === 'object') {
        // handle { "$date": "..." } or { "$date": { "$numberLong": "..." } }
        if (v.$date) {
            const d = typeof v.$date === 'string' ? new Date(v.$date) : (v.$date.$numberLong ? new Date(Number(v.$date.$numberLong)) : null);
            if (d && !isNaN(d.getTime())) return d;
        }
        // if object isn't the expected format, fall through
        return null;
    }
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}

function extractLineItems(record) {
    // 1) flat record.items
    if (Array.isArray(record.items)) {
        return record.items.map(it => ({
            description: it.description || it.desc || '',
            quantity: safeNumber(it.quantity, 1),
            price: safeNumber(it.price ?? it.unitPrice ?? it.totalPrice ?? 0)
        }));
    }

    // 2) deep nested with .value fields
    const itemsPath = record.extractedData?.llmData?.lineItems?.value?.items?.value;
    if (Array.isArray(itemsPath)) {
        return itemsPath.map(it => {
            const desc = it.description?.value ?? it.description ?? '';
            const qty = safeNumber(it.quantity?.value ?? it.quantity ?? 1);
            const price = safeNumber(it.unitPrice?.value ?? it.unitPrice ?? it.totalPrice?.value ?? it.totalPrice ?? 0);
            return { description: desc, quantity: qty, price };
        });
    }

    // 3) sometimes value is directly an array at lineItems.value
    const itemsPath2 = record.extractedData?.llmData?.lineItems?.value;
    if (Array.isArray(itemsPath2)) {
        return itemsPath2.map(it => ({
            description: it.description?.value ?? it.description ?? '',
            quantity: safeNumber(it.quantity?.value ?? it.quantity ?? 1),
            price: safeNumber(it.unitPrice?.value ?? it.unitPrice ?? it.totalPrice?.value ?? it.totalPrice ?? 0)
        }));
    }

    return [];
}

function normalizeStatus(s) {
    if (!s) return 'pending';
    s = String(s).toLowerCase();
    if (['paid', 'pending', 'overdue'].includes(s)) return s;
    // map common alternatives
    if (s === 'processed' || s === 'validated' || s === 'completed') return 'paid'; // or 'pending' as per your logic
    return 'pending';
}

async function importData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Connected to MongoDB');

        // Read JSON file (path relative to project root)
        const filePath = path.join(__dirname, '..', 'Analytics_Test_Data.json');
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);

        if (!Array.isArray(data)) {
            throw new Error('JSON must be an array of records');
        }

        // Uncomment to wipe DB before import
        await Invoice.deleteMany({});
        await Vendor.deleteMany({});

        let imported = 0;
        let skipped = 0;
        for (const record of data) {
            try {
                // Vendor extraction
                const vendorNested = record.extractedData?.llmData?.vendor?.value || {};
                let vendorName = vendorNested?.vendorName?.value ?? vendorNested?.vendorName ?? record.vendorName ?? record.metadata?.title ?? record.name;
                vendorName = vendorName ? String(vendorName).trim() : null;
                const vendorEmail = vendorNested?.vendorEmail?.value ?? vendorNested?.vendorEmail ?? record.vendorEmail ?? null;
                const vendorPhone = vendorNested?.vendorPhone?.value ?? vendorNested?.vendorPhone ?? record.vendorPhone ?? null;

                if (!vendorName) {
                    console.warn('⚠️  Skipping record without vendor name (record._id):', record._id);
                    skipped++;
                    continue;
                }

                // Find or create vendor (match by name)
                let vendorDoc = await Vendor.findOne({ name: vendorName });
                if (!vendorDoc) {
                    vendorDoc = await Vendor.create({
                        name: vendorName,
                        email: vendorEmail || undefined,
                        phone: vendorPhone || undefined,
                        totalSpend: 0
                    });
                } else {
                    const update = {};
                    if (vendorEmail && vendorDoc.email !== vendorEmail) update.email = vendorEmail;
                    if (vendorPhone && vendorDoc.phone !== vendorPhone) update.phone = vendorPhone;
                    if (Object.keys(update).length) {
                        await Vendor.updateOne({ _id: vendorDoc._id }, { $set: update });
                        vendorDoc = await Vendor.findById(vendorDoc._id);
                    }
                }

                // Invoice extraction
                const invoiceNested = record.extractedData?.llmData?.invoice?.value || {};
                const summaryNested = record.extractedData?.llmData?.summary?.value || {};
                const paymentNested = record.extractedData?.llmData?.payment?.value || {};

                const invoiceNumberRaw = invoiceNested?.invoiceId?.value ?? invoiceNested?.invoiceId ?? record.invoiceNumber ?? record._id;
                const invoiceNumber = invoiceNumberRaw ? String(invoiceNumberRaw).trim() : String(record._id);

                // Skip if invoice with same number already exists (avoid unique index error)
                const exists = await Invoice.findOne({ invoiceNumber });
                if (exists) {
                    console.log(`🔁 Skipping duplicate invoice ${invoiceNumber}`);
                    skipped++;
                    continue;
                }

                const I_dateRaw = invoiceNested?.invoiceDate?.value ?? invoiceNested?.invoiceDate ?? record.createdAt?.$date ?? record.createdAt;
                const D_dateRaw = invoiceNested?.deliveryDate?.value ?? invoiceNested?.deliveryDate ?? record.createdAt?.$date ?? record.createdAt;
                const dueDateRaw = paymentNested?.dueDate?.value ?? paymentNested?.dueDate ?? invoiceNested?.deliveryDate?.value ?? invoiceNested?.deliveryDate ?? record.dueDate;
                const amountRaw = summaryNested?.invoiceTotal?.value ?? summaryNested?.invoiceTotal ?? summaryNested?.discountedTotal ?? record.amount ?? 0;
                // const status = String(record.status ?? 'processed');
                const status = normalizeStatus(record.status);
                // const category = summaryNested?.documentType ?? summaryNested?.documentType?.value ?? record.category ?? 'invoice';
                const categoryRaw = summaryNested?.documentType?.value ?? summaryNested?.documentType ?? record.category ?? 'invoice';
                const category = typeof categoryRaw === 'object' ? 'invoice' : String(categoryRaw || 'invoice');

                const invoiceDate = parseDate(I_dateRaw);
                const deliveryDate = parseDate(D_dateRaw)
                const dueDate = parseDate(dueDateRaw);
                const amount = safeNumber(amountRaw, 0);

                const items = extractLineItems(record);
                const invoiceItems = items.map(it => ({
                    description: it.description ?? '',
                    quantity: safeNumber(it.quantity, 1),
                    price: safeNumber(it.price, 0)
                }));

                // Create invoice
                const invoiceDoc = await Invoice.create({
                    invoiceNumber,
                    vendor: vendorDoc._id,
                    invoiceDate,
                    deliveryDate,
                    dueDate,
                    amount,
                    status,
                    category,
                    items: invoiceItems
                });

                // Increment vendor totalSpend (use $inc)
                await Vendor.updateOne({ _id: vendorDoc._id }, { $inc: { totalSpend: amount } });

                imported++;
                console.log(`Imported invoice ${invoiceDoc.invoiceNumber} (vendor: ${vendorDoc.name})`);
            } catch (recErr) {
                console.error('❌ Error importing record:', record._id, recErr.message || recErr);
                // continue with next record
            }
        }

        console.log(`✅ Done. Imported: ${imported}, Skipped/Errors: ${skipped}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Import error:', error);
        process.exit(1);
    }
}

importData();
