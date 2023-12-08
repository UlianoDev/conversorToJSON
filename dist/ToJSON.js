"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var process_1 = require("process");
var xlsx = __importStar(require("xlsx"));
var ToJSON = /** @class */ (function () {
    function ToJSON(fileName, fileExtention, separator) {
        this.fileName = fileName;
        this.fileExtention = fileExtention;
        this.file = "./".concat(fileName, ".").concat(fileExtention);
        this.separator = separator;
        if (fileExtention == "csv" && !separator) {
            console.log("Falha, não foi informado o separador do csv");
            (0, process_1.exit)();
        }
    }
    ToJSON.prototype.readExcelFile = function () {
        var file = xlsx.readFile(this.file);
        var sheetName = file.SheetNames[0];
        var sheet = file.Sheets[sheetName];
        var data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        return data;
    };
    ToJSON.prototype.readCsvFile = function () {
        var _this = this;
        var file = fs.readFileSync(this.file).toString();
        var arrayContentFile = file.split(/\r?\n/);
        var contentFileNoBlankSpaces = arrayContentFile.filter(function (row) { return !row.split("".concat(_this.separator)).every(function (item) { return item.trim() == ''; }); });
        var arrayWithArrays = [];
        contentFileNoBlankSpaces.forEach(function (string) { return arrayWithArrays.push(string.split("".concat(_this.separator))); });
        return arrayWithArrays;
    };
    ToJSON.prototype.dataToJSON = function (typeOfFile) {
        var data = typeOfFile;
        console.log(typeOfFile);
        var keys = data[0];
        var dataValues = data.slice(1);
        var arrayOfObjects = dataValues.map(function (rowValues) {
            var obj = {};
            keys.forEach(function (key, index) {
                obj[key] = rowValues[index] === undefined ? '' : rowValues[index];
            });
            return obj;
        });
        var filterEmptyObjects = arrayOfObjects.filter(function (obj) {
            var values = Object.values(obj);
            var isEmpty = values.every(function (value) { return value === ''; });
            return !isEmpty;
        });
        var object = { "data": filterEmptyObjects };
        return object;
    };
    ToJSON.prototype.writeJsonFromExcel = function () {
        var data = this.dataToJSON(this.readExcelFile());
        var jsonContent = JSON.stringify(data, null, 2);
        fs.writeFileSync('db.json', jsonContent, 'utf-8');
        console.log("O arquivo foi criado com sucesso!");
    };
    ToJSON.prototype.writeJsonFromCsv = function () {
        var data = this.dataToJSON(this.readCsvFile());
        var jsonContent = JSON.stringify(data, null, 2);
        fs.writeFileSync('db.json', jsonContent, 'utf-8');
        console.log("O arquivo foi criado com sucesso!");
    };
    ToJSON.prototype.writeCustomJson = function () {
        var arrayData = this.dataToJSON(this.readExcelFile()).data;
        //obj.nomeOrgao.slice(-2)
        var lastTwoWordsSet = new Set();
        arrayData.forEach(function (obj) {
            var lastTwoWords = obj.nomeOrgao.slice(-2);
            lastTwoWordsSet.add(lastTwoWords);
        });
        var lastTwoWordsArray = Array.from(lastTwoWordsSet);
        var object = {};
        lastTwoWordsArray.forEach(function (event) {
            var arrayOfObjects = arrayData.filter(function (obj) { return obj.nomeOrgao.slice(-2) == event; });
            //const objectReorganized = {event:arrayOfObjects}
            object[event] = arrayOfObjects;
        });
        var jsonContent = JSON.stringify(object, null, 2);
        fs.writeFileSync('db_personalizado.json', jsonContent, 'utf-8');
        console.log("O arquivo personalizado foi criado com sucesso!");
    };
    return ToJSON;
}());
exports.default = ToJSON;
