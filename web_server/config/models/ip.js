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
    getAllTrackedIPRecordsPromise: function (count, limit, page) {
        if (count) {
            return allIPsModel.find({ 'host.hosting_partner': "TRACKED" }).countDocuments().exec();
        } else if (limit !== undefined && limit > 0) {
            return allIPsModel.find({ 'host.hosting_partner': "TRACKED" }).skip(limit * (page - 1)).limit(limit).exec();
        } else {
            return allIPsModel.find({ 'host.hosting_partner': "TRACKED" }).exec();
        }
    },
    getAllManagedIPRecordsPromise: function (count, limit, page) {
        if (count) {
            return allIPsModel.find({ "$or": [{ 'host.hosting_partner': "TRACKED" }, { 'host.splunk': { "$exists": true } }] }).countDocuments().exec();
        } else if (limit !== undefined && limit > 0) {
            return allIPsModel.find({ "$or": [{ 'host.hosting_partner': "TRACKED" }, { 'host.splunk': { "$exists": true } }] }).skip(limit * (page - 1)).limit(limit).exec();
        } else {
            return allIPsModel.find({ "$or": [{ 'host.hosting_partner': "TRACKED" }, { 'host.splunk': { "$exists": true } }] }).exec();
        }
    },
    getIPRecordsByZonePromise: function (zone, count) {
        if (count) {
            return allIPsModel.find({
                'zones': zone,
            }).countDocuments().exec();
        } else {
            return allIPsModel.find({
                'zones': mongoSanitize.sanitize({ data: zone }).data,
            }).exec();
        }
    },
    getIPRecordsByDomainPromise: function (domain, count) {
        if (count) {
            return allIPsModel.find({
                'domains': domain,
            }).countDocuments().exec();
        } else {
            return allIPsModel.find({
                'domains': mongoSanitize.sanitize({ data: domain }).data,
            }).exec();
        }
    },
    getIPRecordsByHostPartnerPromise: function (partner, count, limit, page) {
        if (count) {
            return allIPsModel.find({
                'host.hosting_partner': partner,
            }).countDocuments().exec();
        } else if (limit !== undefined && limit > 0) {
            return allIPsModel.find({
                'host.hosting_partner': partner,
            }).skip(limit * (page - 1)).limit(limit).exec();
        } else {
            return allIPsModel.find({
                'host.hosting_partner': mongoSanitize.sanitize({ data: partner }).data,
            }).exec();
        }
    },
    getIPRecordsByHostCIDRPromise: function (cidr, count) {
        if (count) {
            return allIPsModel.find({
                'host.host_cidr': cidr,
            }).countDocuments().exec();
        } else {
            return allIPsModel.find({
                'host.host_cidr': mongoSanitize.sanitize({ data: cidr }).data,
            }).exec();
        }
    },
    getIPRecordsByIPVersionPromise: function (version, count, limit, page) {
        if (count) {
            return allIPsModel.find({
                'version': version,
            }).countDocuments().exec();
        } else if (limit !== undefined && limit > 0) {
            return allIPsModel.find({
                'version': version,
            }).skip(limit * (page - 1)).limit(limit).exec();
        } else {
            return allIPsModel.find({
                'version': mongoSanitize.sanitize({ data: version }).data,
            }).exec();
        }
    },
    getAllIPRecordsCountPromise: function () {
        return allIPsModel.find({}).countDocuments().exec();
    },
}