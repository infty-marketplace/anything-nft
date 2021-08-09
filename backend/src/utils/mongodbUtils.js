function save(doc) {
    return new Promise((resolve, reject) => {
        doc.save((err, saved) => {
            if (err) {
                reject(err);
            }
            resolve(saved);
        });
    });
}

async function saveAll(schedules) {
    const promises = schedules.map((schedule) => save(schedule));
    return Promise.all(promises)
        .then((responses) => {
            return;
        })
        .catch((error) => {
            throw error;
        });
}

module.exports = { saveAll };
