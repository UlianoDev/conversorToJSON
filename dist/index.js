"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ToJSON_1 = __importDefault(require("./ToJSON"));
var execute = new ToJSON_1.default('orgaos_', 'csv', ';');
execute.writeJsonFromCsv();
//const execute = new ToJSON('orgaos','xlsx');
//execute.writeJsonFromExcel()
