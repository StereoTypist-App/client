module.exports = class Queue {

    constructor(arr) {
        this._data = {}
        this._front = -1
        this._back = -1

        if(arr) {
            arr.forEach((el) => {
                this.enqueue(el)
            })
        }
    }

    enqueue(data) {
        this._back += 1

        if(this._front < 0) this._front = 0

        this._data[this._back] = data
    }

    dequeue() {
        const data = this._data[this._front]
        delete this._data[this._front]

        if(this._front === this._back || this._front === 0) {
            this._front = -1
            this._back = -1
        } else {
            this._front += 1
        }

        if(typeof data === "undefined") {
            return null
        }

        return data
    }

    first() {
        return this._data[this._front]
    }

    last() {
        return this._data[this._back]
    }

    toArray() {
        let els = []

        for(let i = this._front; i <= this._back; i++) {
            els.push(this._data[i])
        }

        return els
    }
}