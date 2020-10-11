/**
 * Examples of use :
 *
 *  Estimate a transfer operation :
 * ```
 * // Assuming that provider and signer are already configured...
 *
 * const amount = 2;
 * const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';
 *
 * // Estimate gasLimit, storageLimit and fees for a transfer operation
 * const est = await Tezos.estimate.transfer({ to: address, amount: amount })
 * console.log(est.burnFeeMutez, est.gasLimit, est.minimalFeeMutez, est.storageLimit,
 *  est.suggestedFeeMutez, est.totalCost, est.usingBaseFeeMutez)
 *
 * ```
 *
 * Estimate a contract origination :
 * ```
 * const est = await Tezos.estimate.originate({
 *   code: michelsonCode,
 *   storage: {
 *     stored_counter: 0,
 *     threshold: 1,
 *     keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
 *   }
 * })
 * console.log(est.burnFeeMutez, est.gasLimit, est.minimalFeeMutez, est.storageLimit,
 *   est.suggestedFeeMutez, est.totalCost, est.usingBaseFeeMutez)
 *
 * ```
 */

export class Estimate {
    constructor() {
        this.MINIMAL_FEE_MUTEZ = 100;
        this.MINIMAL_FEE_PER_BYTE_MUTEZ = 1;
        this.MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;
        this.GAS_BUFFER = 100;
    }

    /**
     * @description The number of Mutez that will be burned for the storage of the [operation](https://tezos.gitlab.io/user/glossary.html#operations). (Storage + Allocation fees)
     */
    burnFeeMutez() {
        return this.roundUp(Number(this.storageLimit) * Number(this.minimalFeePerStorageByteMutez));
    }

    /**
     * @description  The limit on the amount of storage an [operation](https://tezos.gitlab.io/user/glossary.html#operations) can use.
     */
    storageLimit() {
        const limit = Math.max(Number(this._storageLimit), 0);
        return limit > 0 ? limit : 0;
    }

    /**
     * @description The limit on the amount of [gas](https://tezos.gitlab.io/user/glossary.html#gas) a given operation can consume.
     */
    gasLimit() {
        return this.roundUp(Number(this._milligasLimit) / 1000 + this.GAS_BUFFER);
    }

    operationFeeMutez() {
        return (
            (Number(this._milligasLimit) / 1000 + this.GAS_BUFFER) * this.MINIMAL_FEE_PER_GAS_MUTEZ + Number(this.opSize) * this.MINIMAL_FEE_PER_BYTE_MUTEZ
        );
    }

    roundUp(nanotez) {
        return Math.ceil(Number(nanotez));
    }

    /**
     * @description Minimum fees for the [operation](https://tezos.gitlab.io/user/glossary.html#operations) according to [baker](https://tezos.gitlab.io/user/glossary.html#baker) defaults.
     */
    minimalFeeMutez() {
        return this.roundUp(this.MINIMAL_FEE_MUTEZ + this.operationFeeMutez);
    }

    /**
     * @description The suggested fee for the operation which includes minimal fees and a small buffer.
     */
    suggestedFeeMutez() {
        return this.roundUp(this.operationFeeMutez + this.MINIMAL_FEE_MUTEZ * 2);
    }

    /**
     * @description Fees according to your specified base fee will ensure that at least minimum fees are used.
     */
    usingBaseFeeMutez() {
        return (
            Math.max(Number(this.baseFeeMutez), this.MINIMAL_FEE_MUTEZ) + this.roundUp(this.operationFeeMutez)
        );
    }

    /**
     * @description The sum of `minimalFeeMutez` + `burnFeeMutez`.
     */
    totalCost() {
        return this.minimalFeeMutez + this.burnFeeMutez;
    }

    /**
     * @description Since Delphinet, consumed gas is provided in milligas for more precision. 
     * This function returns an estimation of the gas that operation will consume in milligas. 
     */
    consumedMilligas() {
        return Number(this._milligasLimit);
    }
}