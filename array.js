class ArraySet{
    constructor() {
        this.array = new Array();
    }

    has(x) {
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i] == x) {
                return true;
            }
        }
        return false;
    }

    add(x) {
        if (!this.has(x)) {
            this.array.push(x);
        }
    }

    delete(x) {
        if (!this.has(x)) {
            return false;
        }
        for (let i = 0; i < this.array.length; i++) {
            if (this.array[i] == x) {
                this.array.splice(i, 1);
                return true;
            }
        }
    }

    size() {
        return this.array.length;
    }
}

export default ArraySet;