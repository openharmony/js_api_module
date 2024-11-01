/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

interface HelpUtil{
    TextEncoder : Object;
    TextDecoder : Object;
    Base64 : Object;
    Types : Object;
    dealwithformatstring(formatString : string | Array<string | number | Fn>) : string;
    printf(formatString : string | Array<string | number | Fn>,
           ...valueString : Array<Object>) : string;
    getErrorString(errnum : number) : string;
    createExternalType() : Object;
}

interface Fn{
    () : void;
}
declare function requireInternal(s : string) : HelpUtil;
const helpUtil = requireInternal('util');
var TextEncoder = helpUtil.TextEncoder;
var TextDecoder = helpUtil.TextDecoder;
var Base64 = helpUtil.Base64;
var Types = helpUtil.Types;
function switchLittleObject(enter : string, obj : Object, count : number) : string | Object
{
    let str : string = '';
    if (obj === null) {
        str += obj;
    } else if (obj instanceof Array) {
        str += '[ ' + arrayToString(enter, obj, count) + '[length]: ' + obj.length + ' ]';
    } else if (typeof obj === 'function') {
        str += '{ [Function: ' + obj.name + ']' + enter
            + '[length]: ' + obj.length + ',' + enter
            + '[name] :\'' + obj.name + '\',' + enter
            + '[prototype]: ' + obj.name + ' { [constructor]: [Circular] } }';
    } else if (typeof obj === 'object') {
        str += '{ ';
        let i : string;
        let flag : boolean = false;
        for (i in obj) {
            flag = true;
            str += switchLittleValue(enter, i, obj, count);
        }
        if (!flag) {
            return obj;
        }
        str = str.substr(0, str.length - enter.length - 1);
        str += ' }';
    } else if (typeof obj === 'string') {
        str += '\'' + obj + '\'';
    } else {
        str += obj;
    }
    return str;
}

function switchLittleValue(enter : string, protoName : string, obj : Object, count : number) : string
{
    let str : string = '';
    if (obj[protoName] === null) {
        str += protoName + ': null,' + enter;
    } else if (obj[protoName] instanceof Array) {
        str += protoName + ':' + enter
            + '[ ' + arrayToString(enter + '  ', obj[protoName], count) + '[length]: '
            + obj[protoName].length + ' ],' + enter;
    } else if (typeof obj[protoName] === 'object') {
        if (obj[protoName] === obj) {
            str += protoName + ': [Circular]' + enter;
        } else {
            str += protoName + ':' + enter;
            str += switchLittleObject(enter + '  ', obj[protoName], count + 1) + ',' + enter;
        }
    } else if (typeof obj[protoName] === 'function') {
        let space : string= enter;
        if (obj[protoName].name !== '') {
            str += obj[protoName].name + ':' + space;
        }
        space += '  ';
        str += '{ [Function: ' + obj[protoName].name + ']' + space
            + '[length]: ' + obj[protoName].length + ',' + space
            + '[name] :\'' + obj[protoName].name + '\',' + space
            + '[prototype]: ' + obj[protoName].name
            + ' { [constructor]: [Circular] } },' + enter;
    } else {
        if (typeof obj[protoName] === 'string') {
            str += protoName + ': \'' + obj[protoName] + '\',' + enter;
        } else {
            str += protoName + ': ' + obj[protoName] + ',' + enter;
        }
    }
    return str; 
}

function arrayToString(enter : string, arr : Array<string | number | Fn>, count : number) : string
{
    let str : string = '';
    if (!arr.length) {
        return '';
    }
    let arrayEnter : string = ', ';
    for (let k in arr) {
        if (arr[k] !== null && (typeof arr[k] === 'function' || typeof arr[k] === 'object') && count <= 2) {
            arrayEnter += enter;
            break;
        }
    }
    for (let i of arr) {
        if (typeof i === 'string') {
            str += '\'' + i.toString() + '\'' + arrayEnter;
        } else if (typeof i === 'object') {
            str += switchLittleObject(enter + '  ', i, count + 1);
            str += arrayEnter;
        } else if (typeof i === 'function') {
            let space : string = enter;
            space += '  ';
            let end : string = '';
            if (i.name !== '') {
                str += '{ [Function: ' + i.name + ']' + space;
                end = i.name + ' { [constructor]: [Circular] } }' + arrayEnter;
            } else {
                str += '{ [Function]' + space;
                end = '{ [constructor]: [Circular] } }' + arrayEnter;
            }
            str += '[length]: '
                + i.length + ',' + space
                + '[name] :\'' + i.name + '\',' + space
                + '[prototype]: ' + end;
        } else {
            str += i + arrayEnter;
        }
    }
    return str;
}

function switchBigObject(enter : string, obj : Object, count : number) : string | Object
{
    let str : string = '';
    if (obj === null) {
        str += obj;
    } else if (obj instanceof Array) {
        str += '[ ' + arrayToBigString(enter, obj, count) + ' ]';
    } else if (typeof obj === 'function') {
        str += '{ [Function: ' + obj.name + '] }';
    } else if (typeof obj === 'object') {
        str += '{ ';
        let i : string;
        let flag : boolean = false;
        for (i in obj) {
            flag = true;
            str += switchBigValue(enter, i, obj, count);
        }
        if (!flag) {
            return obj;
        }
        str = str.substr(0, str.length - enter.length - 1);
        str += ' }';
    } else if (typeof obj === 'string') {
        str += '\'' + obj + '\'';
    } else {
        str += obj;
    }
    return str;
}

function switchBigValue(enter : string, protoName : string, obj : Object, count : number) : string
{
    let str : string = '';
    if (obj[protoName] === null) {
        str += protoName + ': null,' + enter;
    } else if (obj[protoName] instanceof Array) {
        str += protoName + ':' + enter
            + '[ ' + arrayToBigString(enter + '  ', obj[protoName], count) + ' ],' + enter;
    } else if (typeof obj[protoName] === 'object') {
        if (obj[protoName] === obj) {
            str += protoName + ': [Circular]' + enter;
        } else {
            str += protoName + ':' + enter;
            str += switchBigObject(enter + '  ', obj[protoName], count + 1) + ',' + enter;
        }
    } else if (typeof obj[protoName] === 'function') {
        if (obj[protoName].name !== '') {
            str += obj[protoName].name + ': ';
        }
        str += '[Function: ' + obj[protoName].name + '],' + enter;
    } else {
        if (typeof obj[protoName] === 'string') {
            str += protoName + ': \'' + obj[protoName] + '\',' + enter;
        } else {
            str += protoName + ': ' + obj[protoName] + ',' + enter;
        }
    }
    return str;
}
function arrayToBigString(enter : string, arr : Array<string | number | Fn>, count : number) : string
{
    let str : string = '';
    if (!arr.length) {
        return '';
    }

    let arrayEnter = ', ';
    for (let i of arr) {
        if (i !== null && (typeof i === 'object') && count <= 2) {
            arrayEnter += enter;
            break;
        }
    }
    for (let j of arr) {
        if (typeof j === 'string') {
            str += '\'' + j + '\'' + arrayEnter;
        } else if (typeof j === 'object') {
            str += switchBigObject(enter + '  ', j, count + 1);
            str += arrayEnter;
        } else if (typeof j === 'function') {
            if (j.name !== '') {
                str += '[Function: ' + j.name + ']' + arrayEnter;
            } else {
                str += '[Function]' + arrayEnter;
            }
        } else {
            str += j + arrayEnter;
        }
    }
    str = str.substr(0, str.length - arrayEnter.length);
    return str;
}
function switchIntValue(value : Object | symbol) : string
{
    let str : string = '';
    if (value === '') {
        str += 'NaN';
    } else if (typeof value === 'bigint') {
        str += value + 'n';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += parseInt(value.toString(), 10); // 10:The function uses decimal.
    } else if (value instanceof Array) {
        if (typeof value[0] === 'number') {
            str += parseInt(value[0].toString(), 10); // 10:The function uses decimal.
        } else if (typeof value[0] === 'string') {
            if (isNaN(Number(value[0]))) {
                str += 'NaN';
            } else {
                str += parseInt(value[0], 10); // 10:The function uses decimal.
            }
        }
    } else if (typeof value === 'string') {
        if (isNaN(Number(value))) {
            str += 'NaN';
        } else {
            str += parseInt(value, 10); // 10:The function uses decimal.
        }
    } else {
        str += 'NaN';
    }
    return str;
}
function switchFloatValue(value : Object | symbol) : string
{
    let str : string = '';
    if (value === '') {
        str += 'NaN';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += value;
    } else if (value instanceof Array) {
        if (typeof value[0] === 'number') {
            str += parseFloat(value.toString());
        } else if (typeof value[0] === 'string') {
            if (isNaN(Number(value[0]))) {
                str += 'NaN';
            } else {
                str += parseFloat(value[0]);
            }
        }
    } else if (typeof value === 'string') {
        if (isNaN(Number(value))) {
            str += 'NaN';
        } else {
            str += parseFloat(value);
        }
    } else if (typeof value === 'bigint') {
        str += value;
    } else {
        str += 'NaN';
    }
    return str;
}

function switchNumberValue(value : Object | symbol) : string
{
    let str : string = '';
    if (value === '') {
        str += '0';
    } else if (typeof value === 'symbol') {
        str += 'NaN';
    } else if (typeof value === 'number') {
        str += value;
    } else if (value instanceof Array) {
        str += 'NaN';
    } else if (typeof value === 'string') {
        if (isNaN(Number(value))) {
            str += 'NaN';
        } else {
            str += Number(value);
        }
    } else if (typeof value === 'bigint') {
        str += value.toString() + 'n';
    } else {
        str += 'NaN';
    }
    return str;
}

function switchStringValue(value : Object | symbol) : string
{
    let str : string = '';
    if (typeof value === 'undefined') {
        str += 'undefined';
    } else if (typeof value === 'object') {
        if (value === null) {
            str += 'null';
        } else {
            str += value;
        }
    } else if (typeof value === 'symbol') {
        str += value.toString();
    } else {
        str += value;
    }
    return str;
}
//    printf(formatString : string | Array<string | number | Fn>, 
//           ...valueString : Array<string | number | Fn | object>) : string;
function printf(formatString : Array<string | number | Fn>, ...valueString : Array<Object>) : string
{
    let formats : string = helpUtil.dealwithformatstring(formatString);
    let arr : Array<Object>= [];
    arr = formats.split(' ');
    let switchString : Array<Object>= [];
    let valueLength : number = valueString.length;
    let arrLength : number = arr.length;
    let i : number= 0;
    for (let sub of valueString) {
        if (i >= arrLength) {
            break;
        }
        if (arr[i] === 'o') {
            switchString.push(switchLittleObject('\n  ', sub, 1));
        } else if (arr[i] === 'O') {
            switchString.push(switchBigObject('\n  ', sub, 1));
        } else if (arr[i] === 'i') {
            switchString.push(switchIntValue(sub));
        } else if (arr[i] === 'j') {
            switchString.push(JSON.stringify(sub));
        } else if (arr[i] === 'd') {
            switchString.push(switchNumberValue(sub));
        } else if (arr[i] === 's') {
            switchString.push(switchStringValue(sub));
        } else if (arr[i] === 'f') {
            switchString.push(switchFloatValue(sub));
        } else if (arr[i] === 'c') {
            switchString.push(sub.toString());
        }
        ++i;
    }
    while (i < valueLength) {
        switchString.push(valueString[i].toString());
        i++;
    }
    let helpUtilString : string = helpUtil.printf(formatString, ...switchString);
    return helpUtilString;
}

function getErrorString(errnum : number) : string
{
    let errorString : string = helpUtil.getErrorString(errnum);
    return errorString;
}

function createExternalType() : Object
{
    let externalType : Object = helpUtil.createExternalType();
    return externalType;
}

function callbackified(original : Fn, ...args : Array<string | number | Fn>) : void
{
    const maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
        throw new Error('maybe is not function');
    }
    const cb = (...args : Array<null>) => {
        Reflect.apply(maybeCb, this, args);
    };
    Reflect.apply(original, this, args).then((ret : null) => cb(null, ret), (rej : null) => cb(rej));
}

function getOwnPropertyDescriptors(obj : Fn) : PropertyDescriptorMap
{
    const result : PropertyDescriptorMap = {};
    for (let key of Reflect.ownKeys(obj)) {
        if (typeof key === 'string') {
            result[key] = Object.getOwnPropertyDescriptor(obj, key);
        }
    }
    return result;
}

function callbackWrapper(original : Fn) : void
{
    if (typeof original !== 'function') {
        throw new Error('original is not function');
    }
    const descriptors = getOwnPropertyDescriptors(original);
    if (typeof descriptors.length.value === 'number') {
        descriptors.length.value++;
    }
    if (typeof descriptors.name.value === 'string') {
        descriptors.name.value += 'callbackified';
    }

    function cb(...args : Array<string | number | Fn>) {
        callbackified(original, ...args);
    }
    Object.defineProperties(cb, descriptors);
}

function promiseWrapper(func : Function) : Function
{
    return function (...args : Array<Object>) {
        return new Promise((resolve, reject) => {
            let callback : Function = function (err : Object | string, ...values : Array<Object>) {
                if (err) {
                    reject(err);
                } else {
                    resolve(values);
                }
            };
            func.apply(null, [...args, callback]);
        });
    };
}

class LruBuffer
{
    private cache: Map<Object | undefined, Object | undefined>;
    private maxSize : number = 64;
    private maxNumber : number = 2147483647;
    private putCount : number = 0;
    private createCount : number = 0;
    private evictionCount : number = 0;
    private hitCount : number = 0;
    private missCount : number = 0;
    public length : number = 0;

    public constructor(capacity?: number)
    {
        if (capacity !== undefined) {
            if (capacity <= 0 || capacity % 1 !== 0 || capacity > this.maxNumber) {
                throw new Error('data error');
            }
            this.maxSize = capacity;
        }
        this.cache = new Map();
    }

    public updateCapacity(newCapacity : number) : void
    {
        if (newCapacity <= 0 || newCapacity % 1 !== 0 || newCapacity > this.maxNumber) {
            throw new Error('data error');
        } else if (this.cache.size >newCapacity) {
            this.changeCapacity(newCapacity);
        }
        this.length = this.cache.size;
        this.maxSize = newCapacity;
    }

    public get(key : Object) : Object
    {
        if (key === null) {
            throw new Error('key not be null');
        }
        let value : Object;
        if (this.cache.has(key)) {
            value = this.cache.get(key);
            this.hitCount++;
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        this.missCount++;
        let createValue : Object = this.createDefault(key);
        if (createValue === undefined) {
            return undefined;
        } else {
            value = this.put(key, createValue);
            this.createCount++;
            if (value !== undefined) {
                this.put(key, value);
                this.afterRemoval(false, key, createValue, value);
                return value;
            }
            return createValue;
        }
    }

    public put(key : Object, value : Object) : Object
    {
        if (key === null || value === null) {
            throw new Error('key or value not be null');
        }
        let former : Object;
        this.putCount++;
        if (this.cache.has(key)) {
            former = this.cache.get(key);
            this.cache.delete(key);
            this.afterRemoval(false, key, former, value);
        } else if (this.cache.size >= this.maxSize) {
            this.cache.delete(this.cache.keys().next().value);
            this.evictionCount++;
        }
        this.cache.set(key, value);
        this.length = this.cache.size;
        return former;
    }

    public getCreateCount() : number
    {
        return this.createCount;
    }

    public getMissCount() : number
    {
        return this.missCount;
    }

    public getRemovalCount() : number
    {
        return this.evictionCount;
    }

    public getMatchCount() : number
    {
        return this.hitCount;
    }

    public getPutCount() : number
    {
        return this.putCount;
    }

    public getCapacity() : number
    {
         return this.maxSize;
    }

    public clear() : void
    {
        this.cache.clear();
        this.afterRemoval(false, this.cache.keys(), this.cache.values(), null);
        this.length = this.cache.size;
    }

    public isEmpty() :boolean
    {
        let temp : boolean = false;
        if (this.cache.size === 0) {
            temp = true;
        }
        return temp;
    }

    public contains(key : Object) : boolean
    {
        let flag : boolean = false;
        if (this.cache.has(key)) {
            flag = true;
            let value : Object;
            this.hitCount++;
            value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            this.length = this.cache.size;
            return flag;
        }
        this.missCount++;
        return flag;
    }

    public remove(key : Object) : Object
    {
        if (key === null) {
            throw new Error('key not be null');
        } else if (this.cache.has(key)) {
            let former : Object;
            former = this.cache.get(key);
            this.cache.delete(key);
            if (former !== null) {
                this.afterRemoval(false, key, former, null);
                this.length = this.cache.size;
                return former;
            }
        }
        this.length = this.cache.size;
        return undefined;
    }

    public toString() : string
    {
        let peek : number = 0;
        let hitRate : number = 0;
        peek = this.hitCount + this.missCount;
        if (peek !== 0) {
            hitRate = 100 * this.hitCount / peek;
        } else {
            hitRate = 0;
        }
        let str : string = '';
        str = 'Lrubuffer[ maxSize = ' + this.maxSize + ', hits = ' + this.hitCount + ', misses = ' + this.missCount
            + ', hitRate = ' + hitRate + '% ]';
        return str;
    }

    public values() : Object[]
    {
        let arr : Array<Object> = [];
        for(let value of this.cache.values()) {
            arr.push(value);
        }
        return arr;
    }

    public keys() : Object[]
    {
        let arr : Array<Object> = [];
        for(let key of this.cache.keys()) {
            arr.push(key);
        }
        return arr;
    }

    protected afterRemoval(isEvict : boolean, key : Object | undefined | null, value : Object | undefined | null,
                           newValue : Object | undefined | null) : void
    {

    }

    protected createDefault(key : Object) : Object
    {
        return undefined;
    }

    public entries() : IterableIterator<[Object, Object]>
    {
        return this.cache.entries();
    }

    public [Symbol.iterator] () : IterableIterator<[Object, Object]>
    {
        return this.cache.entries();
    }

    private changeCapacity(newCapacity : number) : void
    {
        while(this.cache.size >newCapacity) {
            this.cache.delete(this.cache.keys().next().value);
            this.evictionCount++;
            this.afterRemoval(true, this.cache.keys(), this.cache.values(), null);
        }
    }
}

class RationalNumber
{
    private mnum : number = 0;
    private mden : number = 0;
    public constructor(num : number, den : number)
    {
        num = den < 0 ?  num * (-1) : num;
        den = den < 0 ?  den * (-1) : den;
        if (den === 0) {
            if (num > 0) {
                this.mnum = 1;
                this.mden = 0;
            } else if (num < 0) {
                this.mnum = -1;
                this.mden = 0;
            } else {
                this.mnum = 0;
                this.mden = 0;
            }
        } else if (num === 0) {
            this.mnum = 0;
            this.mden = 1;
        } else {
            let gnum : number = 0;
            gnum = this.getCommonDivisor(num, den);
            if (gnum !== 0) {
                this.mnum = num / gnum;
                this.mden = den / gnum;
            }
        }
    }

    public createRationalFromString(str : string): RationalNumber
    {
        if (str === null) {
            throw new Error('string invalid!');
        }
        if (str === 'NaN') {
            return new RationalNumber(0, 0);
        }
        let colon : number = str.indexOf(':');
        let semicolon : number = str.indexOf('/');
        if ((colon < 0 && semicolon < 0) || (colon > 0 && semicolon > 0)) {
            throw new Error('string invalid!');
        }
        let index : number = (colon > 0) ? colon : semicolon;
        let s1 : string = str.substr(0, index);
        let s2 : string = str.substr(index + 1, str.length);
        let num1 : number = Number(s1);
        let num2 : number = Number(s2);
        return new RationalNumber(num1, num2);
    }

    public compareTo(other : RationalNumber) : number
    {
        if (this.mnum === other.mnum && this.mden === other.mden) {
            return 0;
        } else if (this.mnum === 0 && this.mden === 0) {
            return 1;
        } else if ((other.mnum === 0) && (other.mden === 0)) {
            return -1;
        } else if ((this.mden === 0 && this.mnum > 0) || (other.mden === 0 && other.mnum < 0)) {
            return 1;
        } else if ((this.mden === 0 && this.mnum < 0) || (other.mden === 0 && other.mnum > 0)) {
            return -1;
        }
        let thisnum : number = this.mnum * other.mden;
        let othernum : number = other.mnum * this.mden;
        if (thisnum < othernum) {
            return -1;
        } else if (thisnum > othernum) {
            return 1;
        } else {
            return 0;
        }
    }

    public equals(obj : object) :boolean
    {
        if (!(obj instanceof RationalNumber)) {
            return false;
        }
        let thisnum : number = this.mnum * obj.mden;
        let objnum : number = obj.mnum * this.mden;
        if (this.mnum === obj.mnum && this.mden === obj.mden) {
            return true;
        } else if ((thisnum === objnum) && (this.mnum !== 0 && this.mden !== 0) && (obj.mnum !== 0 && obj.mden !== 0)) {
            return true;
        } else if ((this.mnum === 0 && this.mden !== 0) && (obj.mnum === 0 && obj.mden !== 0)) {
            return true;
        } else if ((this.mnum > 0 && this.mden === 0) && (obj.mnum > 0 && obj.mden === 0)) {
            return true;
        } else if ((this.mnum < 0 && this.mden === 0) && (obj.mnum < 0 && obj.mden === 0)) {
            return true;
        } else {
            return false;
        }
    }

    public valueOf() : number
    {
        if (this.mnum > 0 && this.mden === 0) {
            return Number.POSITIVE_INFINITY;
        } else if (this.mnum < 0 && this.mden === 0) {
            return Number.NEGATIVE_INFINITY;
        } else if ((this.mnum === 0) && (this.mden === 0)) {
            return Number.NaN;
        } else {
            return this.mnum / this.mden;
        }
    }

    public getCommonDivisor(number1 : number, number2 : number) : number
    {
        if (number1 === 0 || number2 === 0) {
            throw new Error('Parameter cannot be zero!');
        }
        let temp : number = 0;
        if (number1 < number2) {
            temp = number1;
            number1 = number2;
            number2 = temp;
        }
        while (number1 % number2 !== 0) {
            temp = number1 % number2;
            number1 = number2;
            number2 = temp;
        }
        return number2;
    }

    public getDenominator() :number
    {
        return this.mden;
    }

    public getNumerator() : number
    {
        return this.mnum;
    }

    public isFinite() : boolean
    {
        return this.mden !== 0;
    }

    public isNaN() : boolean
    {
        return this.mnum === 0 && this.mden === 0;
    }

    public isZero() : boolean
    {
        return this.mnum === 0 && this.mden !== 0;
    }

    public toString() : string
    {
        let buf : string;
        if (this.mnum === 0 && this.mden === 0) {
            buf = 'NaN';
        } else if (this.mnum > 0 && this.mden === 0) {
            buf = 'Infinity';
        } else if (this.mnum < 0 && this.mden === 0) {
            buf = '-Infinity';
        } else {
            buf = String(this.mnum) + '/' + String(this.mden);
        }
        return buf;
    }
}

interface ScopeComparable {
    compareTo(other: ScopeComparable): boolean;
}

type ScopeType = ScopeComparable;

class Scope {
    private readonly _lowerLimit: ScopeType;
    private readonly _upperLimit: ScopeType;

    public constructor(readonly lowerObj: ScopeType, readonly upperObj: ScopeType) {
        this.checkNull(lowerObj, 'lower limit not be null');
        this.checkNull(upperObj, 'upper limit not be null');

        if(lowerObj.compareTo(upperObj)) {
            throw new Error('lower limit must be less than or equal to upper limit');
        }
        this._lowerLimit = lowerObj;
        this._upperLimit = upperObj;
    }

    public getLower(): ScopeType {
        return this._lowerLimit;
    }
    
    public getUpper(): ScopeType {
        return this._upperLimit;
    }
    
    public compareTo(): boolean {
        return false;
    }

    public contains(value: ScopeType): boolean;
    public contains(scope: Scope): boolean;
    public contains(x: Scope|ScopeType): boolean {
        let resLower: boolean;
        let resUpper: boolean;
        this.checkNull(x, 'value must not be null');
        if (x instanceof Scope) {
            resLower= x._lowerLimit.compareTo(this._lowerLimit);
            resUpper= this._upperLimit.compareTo(x._upperLimit);
        } else {
            resLower= x.compareTo(this._lowerLimit);
            resUpper= this._upperLimit.compareTo(x);
        }
        return resLower && resUpper;
    }

    public clamp(value: ScopeType): ScopeType {
        this.checkNull(value, 'value must not be null');
        if (!value.compareTo(this._lowerLimit)) {
            return this._lowerLimit;
        } else if (value.compareTo(this._upperLimit)) {
            return this._upperLimit;
        } else {
            return value;
        }
    }

    public intersect(scope: Scope): Scope;
    public intersect(lowerObj: ScopeType, upperObj: ScopeType): Scope;
    public intersect(x: Scope, y?: Scope|ScopeType): Scope {
        let reLower: boolean;
        let reUpper: boolean;
        let mLower: ScopeType;
        let mUpper: ScopeType;
        if (y) {
            this.checkNull(x, 'lower limit must not be null');
            this.checkNull(y, 'upper limit must not be null');
            reLower = this._lowerLimit.compareTo(x);
            reUpper = y.compareTo(this._upperLimit);
            if (reLower && reUpper) {
                return this;
            } else {
            mLower = reLower ? this._lowerLimit : x;
            mUpper = reUpper ? this._upperLimit : y;
            return new Scope(mLower, mUpper);
            }
        } else {
            this.checkNull(x, 'scope must not be null');
            reLower = this._lowerLimit.compareTo(x._lowerLimit);
            reUpper = x._upperLimit.compareTo(this._upperLimit);
            if (!reLower && !reUpper) {
                return x;
            } else if (reLower && reUpper) {
                return this;
            } else {
                mLower = reLower ? this._lowerLimit : x._lowerLimit;
                mUpper = reUpper ? this._upperLimit : x._upperLimit;
                return new Scope(mLower, mUpper);
           }
        }
    }

    public expand(obj: ScopeType): Scope;
    public expand(scope: Scope): Scope;
    public expand(lowerObj: ScopeType, upperObj: ScopeType): Scope;
    public expand(x: ScopeType, y?: ScopeType): Scope {
        let reLower: boolean;
        let reUpper: boolean;
        let mLower: ScopeType;
        let mUpper: ScopeType;
        if (!y) {
            this.checkNull(x, 'value must not be null');
            if (!(x instanceof Scope)) {
                this.checkNull(x, 'value must not be null');
                return this.expand(x, x);
            }
            reLower = x._lowerLimit.compareTo(this._lowerLimit);
            reUpper = this._upperLimit.compareTo(x._upperLimit);
            if (reLower && reUpper) {
                 return this;
            } else if (!reLower && !reUpper) {
                 return x;
            } else {
                mLower = reLower ? this._lowerLimit : x._lowerLimit;
                mUpper = reUpper ? this._upperLimit : x._upperLimit;
                return new Scope(mLower, mUpper);
            }

        } else {
            this.checkNull(x, 'lower limit must not be null');
            this.checkNull(y, 'upper limit must not be null');
            reLower = x.compareTo(this._lowerLimit);
            reUpper = this._upperLimit.compareTo(y);
            if (reLower && reUpper) {
                return this;
            }
            mLower = reLower ? this._lowerLimit : x;
            mUpper = reUpper ? this._upperLimit : y;
            return new Scope(mLower, mUpper);
        }
    }

    public toString(): string {
        let strLower : string = this._lowerLimit.toString();
        let strUpper : string = this._upperLimit.toString();
        return `[${strLower}, ${strUpper}]`;
    }

    public checkNull(o: ScopeType, str: string): void {
        if (o === null) {
            throw new Error(str);
        }
    }
}

export default {
    printf: printf,
    getErrorString: getErrorString,
    callbackWrapper: callbackWrapper,
    promiseWrapper: promiseWrapper,
    createExternalType: createExternalType,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    Base64: Base64,
    types: Types,
    LruBuffer: LruBuffer,
    RationalNumber : RationalNumber,
    Scope : Scope,
};
