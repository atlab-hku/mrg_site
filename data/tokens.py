import json
import string

from collections import defaultdict

from nltk import ngrams
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords


stops = set(stopwords.words('english') + list(string.punctuation) + ["'s", "n't", "rt"])

def load_photos(filename="photos.json"):
    return json.loads(open(filename).read())

def valid_token(w):
    return ((w != None) and 
            len(w) > 2 and
            (not w.isnumeric()) and 
            (w not in stops))

def group_by_tokens(photos):
    results = defaultdict(list)
    for photo in photos:
        title = photo["title"]
        tokenized = word_tokenize(title.lower())
        unigrams = set([w for w in tokenized if valid_token(w)])
        bigrams = set(ngrams(tokenized, 2, pad_left=True, pad_right=True))
        bigrams = [' '.join(bg) for bg in bigrams 
                   if all([valid_token(w) for w in bg])]
        for unigram in unigrams:
            results[unigram].append(photo["id"])
        for bigram in bigrams:
            results[bigram].append(photo["id"])

    return results

def filter_selected(all_tokens):
    selected = set([line.strip() for line in open("selected.txt")])
    return {k: v for k, v in all_tokens.items() if k in selected}

def combine(by_tokens, to_combine, new_key=None):
    if new_key is None:
        new_key = " ".join(to_combine)
    res = by_tokens.copy()
    
    # combine lists and remove duplicates
    combined_val = set(res[to_combine[0]])
    for key in to_combine[1:]:
        combined_val = combined_val.union(set(res[key]))

    combined_val = list(combined_val)
    res[new_key] = combined_val
    for key in to_combine:
        del res[key]
    return res

def combine_plurals(by_tokens, singular, plural):
    return combine(
        by_tokens, 
        [singular, plural],
        f"{singular}(s)"
    )

def combine_selected(by_tokens):
    plurals = [
        ("car", "cars"),
        ("commercial building", "commercial buildings"),
        ("drug", "drugs"),
        ("elk", "elks"),
        ("garden", "gardens"),
        ("game", "games"),
        ("gift", "gifts"),
        ("hole", "holes"),
        ("hotel", "hotels"),
#        ("lane", "lanes"),
        ("night", "nights"),
        ("pine", "pines"),
#        ("rapid", "rapids"),
        ("resort", "resorts"),
        ("store", "stores"),
        ("street", "streets"),
    ]
    res = by_tokens.copy()
    for pair in plurals:
        res = combine_plurals(res, *pair)

    res = combine(
        res,
        [
            "miniature golf",
            "putt-putt",
            "mini golf", 
            "mini-golf"
        ],
        "miniature golf"
    )
    return res

def load_final():
    photos = load_photos()
    by_tokens = group_by_tokens(photos)
    selected = filter_selected(by_tokens)
    combined = combine_selected(selected)
    return combined