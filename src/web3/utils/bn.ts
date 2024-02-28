// @ts-nocheck
//-----------------------------------------------------------------------------------------------//
import BigNumber from 'bignumber.js';
import Decimals from 'decimal.js';
import _ from 'lodash';
import value from './value';


//-----------------------------------------------------------------------------------------------//
class BN extends BigNumber {
  public web3dp: BN = null as any;
  public wei: BN = null as any;
  public ether: BN = null as any;

  constructor(n: value, web3dp?: value, isEther = false) {
    BigNumber.config({
      EXPONENTIAL_AT: [-1e9, 1e9],
    });

    n = _.isNil(n) || _.isNaN(n) ? NaN : n;
    super(BN.cleanFormat(n));

    if (web3dp) {
      this.web3dp = new BN(web3dp);
      this.wei = isEther ? this.etherToWei(web3dp) : this;
      this.ether = isEther ? this : this.weiToEther(web3dp);
    } else {
      this.wei = (n as any).wei || this;
      this.ether = (n as any).ether || this;
    }
  }

  public etherToWei(dp: value): BN {
    const _dp = new BN(dp);
    return this.mul(`1e${_dp}`).trunc();
  }
  public static etherToWei(n: value, dp: value): BN {
    const _n = new BN(n);
    const _dp = new BN(dp);
    return _n.mul(`1e${_dp}`).trunc();
  }

  public weiToEther(dp: value): BN {
    const _dp = new BN(dp);
    return this.div(`1e${_dp}`);
  }
  public static weiToEther(n: value, dp: value): BN {
    const _n = new BN(n);
    const _dp = new BN(dp);
    return _n.div(`1e${_dp}`);
  }

  public _1e(): BN {
    return new BN(`1e${this}`);
  }
  public static _1e(n: value): BN {
    const _n = new BN(n);
    return new BN(`1e${_n}`);
  }

  public add(n: value): BN {
    const _n = new BN(n);
    return new BN(this.plus(_n));
  }
  public static add(a: value, b: value): BN {
    const _a = new BN(a);
    const _b = new BN(b);
    return new BN(_a.plus(_b));
  }

  public sub(n: value): BN {
    const _n = new BN(n);
    return new BN(this.minus(_n));
  }
  public static sub(a: value, b: value): BN {
    const _a = new BN(a);
    const _b = new BN(b);
    return new BN(_a.minus(_b));
  }

  public mul(n: value): BN {
    const _n = new BN(n);
    return new BN(this.multipliedBy(_n));
  }
  public static mul(a: value, b: value): BN {
    const _a = new BN(a);
    const _b = new BN(b);
    return new BN(_a.multipliedBy(_b));
  }

  public div(n: value): BN {
    const _n = new BN(n);
    const res = new BN(this.dividedBy(_n));
    return res.isNaN() ? new BN(0) : res;
  }
  public static div(numerator: value, denominator: value): BN {
    const _numerator = new BN(numerator);
    const _denominator = new BN(denominator);
    const res = new BN(_numerator.dividedBy(_denominator));
    return res.isNaN() ? new BN(0) : res;
  }

  public percent(n: value): BN {
    const _n = new BN(n);
    return this.mul(_n).div(100)
  }
  public static percent(n: value, percent: value): BN {
    const _n = new BN(n);
    const _percent = new BN(percent);
    return _n.mul(_percent).div(100)
  }

  public trunc(dp: value = 0): BN {
    const _dp = new BN(dp);
    return new BN(this.toFixed(_dp.toNumber(), BN.ROUND_DOWN));
  }
  public static trunc(n: value, dp: value = 0): BN {
    const _n = new BN(n);
    const _dp = new BN(dp);
    return new BN(_n.toFixed(_dp.toNumber(), BN.ROUND_DOWN));
  }

  public round(dp = 0): BN {
    const _dp = new BN(dp);
    return new BN(this.toFixed(_dp.toNumber(), BN.ROUND_HALF_UP));
  }
  public static round(n: value, dp = 0): BN {
    const _n = new BN(n);
    const _dp = new BN(dp);
    return new BN(_n.toFixed(_dp.toNumber(), BN.ROUND_HALF_UP));
  }

  public integer(): BN {
    return new BN(this.toString().split('.')[0]);
  }
  public static integer(n: value): BN {
    const _n = new BN(n);
    return new BN(_n.toString().split('.')[0]);
  }

  public decimals(): BN {
    return new BN(this.toString().split('.')[1] || '0');
  }
  public static decimals(n: value): BN {
    const _n = new BN(n);
    return new BN(_n.toString().split('.')[1] || '0');
  }

  public toHex(): string {
    return '0x' + this.toString(16);
  }
  public static toHex(n: value): string {
    const _n = new BN(n);
    if (String(_n) == 'NaN') {
      return null as any
    } else {
      return '0x' + _n.toString(16);
    }
  }

  public format(dp: value = 2, trailingZeros: boolean = true): string {
    const integer =
      (this.isNegative() && this.integer().eq(0) ? '-' : '') // handle signed 0
      + this.integer()
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const rawDec = this.trunc(dp).toString().split('.')[1] || '0'
    let processedDec = ''
    for (let i = 0; i < Number(dp); i++) {
      let nextDec = rawDec[i]
      if (new BN(nextDec).isNaN()) {
        nextDec = '0'
      }
      processedDec += nextDec
    }

    // remove or keep trailing 0
    if (!trailingZeros) {
      let j = processedDec.length - 1
      while (processedDec[j] == '0') {
        processedDec = processedDec.slice(0, j)
        j--
      }
    }

    // remove or keep '.'
    if (processedDec.length > 0) {
      processedDec = '.' + processedDec
    }

    return integer + processedDec;
  }
  public static format(n: value, dp: value = 2, trailingZeros: boolean = true): string {
    return new BN(n).format(dp, trailingZeros)
  }

  public diff(n: value): boolean {
    const _n = new BN(n);
    return this.eq(_n)
      ? false
      : true
  }
  public static diff(n: value, val: value): boolean {
    const _n = new BN(n);
    const _val = new BN(val);
    return _n.eq(_val)
      ? false
      : true
  }

  public static lt(a: value, b: value): boolean {
    const _a = new BN(a);
    const _b = new BN(b);
    return _a.lt(_b)
  }

  public static max(...values: value[]): BN {
    return new BN(Math.max(...values.map(v => new BN(v).toNumber())))
  }

  public static min(...values: value[]): BN {
    return new BN(Math.min(...values.map(v => new BN(v).toNumber())))
  }

  public abs(): BN {
    return new BN(this.absoluteValue())
  }

  public pow(n: value): BN {
    const _n = new BN(n);
    const res = Decimals.pow(this.toString(), _n.toString())
    return new BN(res.toString());
  }

  private static cleanFormat(n: value): string {
    return n.toString().replaceAll(',', '');
  }
}


const isBN = (x: any): boolean => _.has(x, 's') && _.has(x, 'e') && _.has(x, 'c') ? true : false


//-----------------------------------------------------------------------------------------------//
export default BN
export {
  isBN,
}


//-----------------------------------------------------------------------------------------------//