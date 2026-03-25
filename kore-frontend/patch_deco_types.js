const fs = require('fs');

const tp = 'c:/Projects/Startup_Analyser/kore-frontend/src/lib/dummyData.ts';
let code = fs.readFileSync(tp, 'utf8');

const anchor = 'export const DUMMY_PAYLOAD: DashboardPayload = ';
const idx = code.indexOf(anchor);

if (idx !== -1) {
    const rawJson = code.slice(idx + anchor.length).trim().replace(/;$/, '');
    let payload = JSON.parse(rawJson);

    // Filter out invalid keys from specific modules
    if (payload.modules) {
        payload.modules.forEach(m => {
            if (m.type === 'deco.stats') {
                if (m.data.metrics) {
                    m.data.metrics.forEach(item => {
                        delete item.deltaType;
                        delete item.direction;
                    });
                }
                if (m.data.stats) {
                    m.data.stats.forEach(item => {
                        delete item.deltaType;
                        delete item.direction;
                    });
                }
            }
        });
    }

    const newCode = code.slice(0, idx + anchor.length) + JSON.stringify(payload) + ';\n';
    fs.writeFileSync(tp, newCode);
    console.log('Successfully stripped excess TS keys from deco.stats.');
} else {
    console.log('Payload anchor not found.');
}
