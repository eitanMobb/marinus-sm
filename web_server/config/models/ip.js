'use strict';

/**
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const mongoSanitize = require('express-mongo-sanitize');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// All_IPs model
const allIPsSchema = new Schema({
    ip: String,
    created: Date,
    updated: Date,
    version: Number,
    reverse_dns: String,
    zones: [],
    domains: [],
    sources: [{ source: String, updated: Date }],
    host: {
        hosting_partner: String,
        host_cidr: String,
        notes: String,
        splunk: {},
    }
}, {
    collection: 'all_ips',
});


const allIPsModel = mongoose.model('allIPsModel', allIPsSchema);

module.exports = {
    AllIPsModel: allIPsModel,
    getAllIPRecordsPromise: function (limit, page) {
        if (limit !== undefined && limit > 0) {
            return allIPsModel.find({}).skip(limit * (page - 1)).limit(limit).exec();
        } else {
            return allIPsModel.find({}).exec();
        }
    },
    getIPRecordsByIPPromise: function (ip) {
        return allIPsModel.find({
            'ip': mongoSanitize.sanitize({ data: ip }).data,
        }).exec();
    },
}
