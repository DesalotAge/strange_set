const FUNCTION = "function",
	STRING = "string";

const EXISTENCE = 0,
	ENTRY = 1,
	ENTRY_INDEX_AND_VALUE = 2;

const arrayRemoveAt = (typeof Array.prototype.splice == FUNCTION) ?
	function (arr, idx) {
		arr.splice(idx, 1);
	} :
	function (arr, idx) {
		let itemsAfterDeleted, i, len;
		if (idx === arr.length - 1) {
			arr.length = idx;
		} else {
			itemsAfterDeleted = arr.slice(idx + 1);
			arr.length = idx;
			for (i = 0, len = itemsAfterDeleted.length; i < len; ++i) {
				arr[idx + i] = itemsAfterDeleted[i];
			}
		}
	};

function hashObject(obj) {
	let hashCode;
	if (typeof obj == STRING) {
		return obj;
	} else if (typeof obj.hashCode == FUNCTION) {
		hashCode = obj.hashCode();
		return (typeof hashCode == STRING) ? hashCode : hashObject(hashCode);
	} else if (typeof obj.toString == FUNCTION) {
		return obj.toString();
	} else {
		return String(obj);
	}
}

function equals_fixedValueHasEquals(fixedValue, variableValue) {
	return fixedValue.equals(variableValue);
}

function equals_fixedValueNoEquals(fixedValue, variableValue) {
	return (typeof variableValue.equals == FUNCTION) ?
		variableValue.equals(fixedValue) : (fixedValue === variableValue);
}

function createKeyValCheck(kvStr) {
	return function (kv) {
		if (kv === null) {
			throw new Error("null is not a valid " + kvStr);
		} else if (typeof kv == "undefined") {
			throw new Error(kvStr + " must not be undefined");
		}
	};
}

const checkKey = createKeyValCheck("key"), checkValue = createKeyValCheck("value");

class Bucket {
	constructor(hash, firstKey, firstValue, equalityFunction) {
		this[0] = hash;
		this.entries = [];
		this.addEntry(firstKey, firstValue);

		if (equalityFunction !== null) {
			this.getEqualityFunction = function () {
				return equalityFunction;
			};
		}
	}

	createBucketSearcher(mode, key) {
		let i = this.entries.length, entry, equals = this.getEqualityFunction(key);
		while (i--) {
			entry = this.entries[i];
			if (equals(key, entry[0])) {
				switch (mode) {
					case EXISTENCE:
						return true;
					case ENTRY:
						return entry;
					case ENTRY_INDEX_AND_VALUE:
						return [i, entry[1]];
				}
			}
		}
		return false;
	}

	createBucketLister(entryProperty, aggregatedArr) {
		let startIndex = aggregatedArr.length;
		for (let i = 0, len = this.entries.length; i < len; ++i) {
			aggregatedArr[startIndex + i] = this.entries[i][entryProperty];
		}
	}

	getEqualityFunction(searchValue) {
		return (typeof searchValue.equals == FUNCTION) ? equals_fixedValueHasEquals : equals_fixedValueNoEquals;
	}

	getEntryForKey(key) {
		return this.createBucketSearcher(ENTRY, key);
	}

	getEntryAndIndexForKey(key) {
		return this.createBucketSearcher(ENTRY_INDEX_AND_VALUE, key);
	}

	containsKey(key) {
		return this.createBucketSearcher(EXISTENCE, key);
	}

	removeEntryForKey(key) {
		let result = this.getEntryAndIndexForKey(key);
		if (result) {
			arrayRemoveAt(this.entries, result[0]);
			return result[1];
		}
		return null;
	}

	addEntry(key, val) {
		this.entries[this.entries.length] = [key, val];
	}

	keys(aggregatedArr) {
		return this.createBucketLister(0, aggregatedArr);
	}

	values(aggregatedArr) {
		return this.createBucketLister(1, aggregatedArr);
	}

	getEntries(entries) {
		let startIndex = entries.length;
		for (let i = 0, len = this.entries.length; i < len; ++i) {
			// Clone the entry stored in the bucket before adding to array
			entries[startIndex + i] = this.entries[i].slice(0);
		}
	}

	containsValue(value) {
		let i = this.entries.length;
		while (i--) {
			if (value === this.entries[i][1]) {
				return true;
			}
		}
		return false;
	}
};

function searchBuckets(buckets, hash) {
	let i = buckets.length, bucket;
	while (i--) {
		bucket = buckets[i];
		if (hash === bucket[0]) {
			return i;
		}
	}
	return null;
}

function getBucketForHash(bucketsByHash, hash) {
	let bucket = bucketsByHash[hash];

	return (bucket && (bucket instanceof Bucket)) ? bucket : null;
}


class Hashtable {
	constructor(hashingFunctionParam, equalityFunctionParam) {
		this.buckets = [];
		this.bucketsByHash = {};

		this.hashingFunction = (typeof hashingFunctionParam == FUNCTION) ? hashingFunctionParam : hashObject;
		this.equalityFunction = (typeof equalityFunctionParam == FUNCTION) ? equalityFunctionParam : null;

	}

	put(key, value) {
		checkKey(key);
		checkValue(value);
		let hash = this.hashingFunction(key), bucket, bucketEntry, oldValue = null;

		// Check if a bucket exists for the bucket key
		bucket = getBucketForHash(this.bucketsByHash, hash);
		if (bucket) {
			// Check this bucket to see if it already contains this key
			bucketEntry = bucket.getEntryForKey(key);
			if (bucketEntry) {
				// This bucket entry is the current mapping of key to value, so replace old value and we're done.
				oldValue = bucketEntry[1];
				bucketEntry[1] = value;
			} else {
				// The bucket does not contain an entry for this key, so add one
				bucket.addEntry(key, value);
			}
		} else {
			// No bucket exists for the key, so create one and put our key/value mapping in
			bucket = new Bucket(hash, key, value, this.equalityFunction);
			this.buckets[this.buckets.length] = bucket;
			this.bucketsByHash[hash] = bucket;
		}
		return oldValue;
	}

	get(key) {
		checkKey(key);

		let hash = this.hashingFunction(key);

		// Check if a bucket exists for the bucket key
		let bucket = getBucketForHash(this.bucketsByHash, hash);
		if (bucket) {
			// Check this bucket to see if it contains this key
			let bucketEntry = bucket.getEntryForKey(key);
			if (bucketEntry) {
				// This bucket entry is the current mapping of key to value, so return the value.
				return bucketEntry[1];
			}
		}
		return null;
	}

	containsKey(key) {
		checkKey(key);
		let bucketKey = this.hashingFunction(key);

		// Check if a bucket exists for the bucket key
		let bucket = getBucketForHash(this.bucketsByHash, bucketKey);

		return bucket ? bucket.containsKey(key) : false;
	}

	containsValue(value) {
		checkValue(value);
		let i = this.buckets.length;
		while (i--) {
			if (this.buckets[i].containsValue(value)) {
				return true;
			}
		}
		return false;
	}

	clear() {
		this.buckets.length = 0;
		this.bucketsByHash = {};
	}

	createBucketAggregator(bucketFuncName) {
		let aggregated = [], i = this.buckets.length;
		while (i--) {
			this.buckets[i][bucketFuncName](aggregated);
		}
		return aggregated;
	}

	keys() {
		return this.createBucketAggregator("keys");
	}
	values() {
		return this.createBucketAggregator("values");
	}
	entries()  {
		return this.createBucketAggregator("getEntries");
	}

	remove(key) {
		checkKey(key);

		let hash = this.hashingFunction(key), bucketIndex, oldValue = null;

		let bucket = getBucketForHash(this.bucketsByHash, hash);

		if (bucket) {
			oldValue = bucket.removeEntryForKey(key);
			if (oldValue !== null) {
				if (!bucket.entries.length) {
					bucketIndex = searchBuckets(this.buckets, hash);
					arrayRemoveAt(this.buckets, bucketIndex);
					delete this.bucketsByHash[hash];
				}
			}
		}
		return oldValue;
	}

	size() {
		let total = 0, i = this.buckets.length;
		while (i--) {
			total += this.buckets[i].entries.length;
		}
		return total;
	}

	putAll(hashtable, conflictCallback) {
		let entries = hashtable.entries();
		let entry, key, value, thisValue, i = entries.length;
		let hasConflictCallback = (typeof conflictCallback == FUNCTION);
		while (i--) {
			entry = entries[i];
			key = entry[0];
			value = entry[1];
			if (hasConflictCallback && (thisValue = this.get(key))) {
				value = conflictCallback(key, thisValue, value);
			}
			this.put(key, value);
		}
	}

	clone() {
		let clone = new Hashtable(hashingFunctionParam, equalityFunctionParam);
		clone.putAll(that);
		return clone;
	}
}


export default Hashtable;
