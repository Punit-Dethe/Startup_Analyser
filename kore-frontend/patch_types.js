const fs = require('fs');

const tp = 'c:/Projects/Startup_Analyser/kore-frontend/src/lib/dummyData.ts';
let code = fs.readFileSync(tp, 'utf8');

// Fix the DecoMetric / KPI "deltaType" to "direction" 
code = code.replace(/"deltaType"\s*:\s*"good"/g, '"direction":"up"');
code = code.replace(/"deltaType"\s*:\s*"bad"/g, '"direction":"down"');
code = code.replace(/"deltaType"\s*:\s*"neutral"/g, '"direction":"neutral"');
code = code.replace(/"deltaType1"\s*:\s*"good"/g, '"direction1":"up"');
code = code.replace(/"deltaType2"\s*:\s*"good"/g, '"direction2":"up"');
code = code.replace(/"deltaType"\s*:\s*""/g, '"direction": "neutral"');

// Fix TableColumn "id" to "key":
// E.g., {"id":"metric","label":"Metric"} -> {"key":"metric","label":"Metric"}
// We only want to replace "id" inside columns arrays. Instead of a complex regex, we'll parse JSON, edit, rewrite.

const anchor = 'export const DUMMY_PAYLOAD: DashboardPayload = ';
const idx = code.indexOf(anchor);

if (idx !== -1) {
    const rawJson = code.slice(idx + anchor.length).trim().replace(/;$/, '');
    let payload = JSON.parse(rawJson);

    // Recursively walk payload and fix keys
    function fixKeys(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(fixKeys);
        } else if (typeof obj === 'object' && obj !== null) {
            // Fix deltaType -> direction
            if (obj.hasOwnProperty('deltaType')) {
                const val = obj.deltaType;
                if (val === 'good' || val === 'positive') obj.direction = 'up';
                else if (val === 'bad' || val === 'negative') obj.direction = 'down';
                else obj.direction = 'neutral';
                delete obj.deltaType;
            }
            if (obj.hasOwnProperty('deltaType1')) {
                obj.direction1 = 'up'; delete obj.deltaType1;
            }
            if (obj.hasOwnProperty('deltaType2')) {
                obj.direction2 = 'up'; delete obj.deltaType2;
            }

            // Fix columns in tables
            if (obj.hasOwnProperty('columns') && Array.isArray(obj.columns)) {
                obj.columns.forEach(col => {
                    if (col.hasOwnProperty('id') && !col.hasOwnProperty('key')) {
                        col.key = col.id;
                        delete col.id;
                    }
                });
            }
            Object.values(obj).forEach(fixKeys);
        }
    }

    fixKeys(payload);

    const newCode = code.slice(0, idx + anchor.length) + JSON.stringify(payload) + ';\n';
    fs.writeFileSync(tp, newCode);
    console.log('Successfully patched TypeScript hallucination bugs.');
} else {
    console.log('Payload anchor not found.');
}
