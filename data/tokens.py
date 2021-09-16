import json
import string

from collections import defaultdict

from nltk import ngrams
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords


stops = set(stopwords.words('english') + list(string.punctuation) + ["'s", "n't", "rt"])

def load(filename="photos.json"):
    return json.loads(open(filename).read())

def valid_token(w):
    return (w != None) and (not w.isnumeric()) and (w not in stops)

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

def distribution(by_tokens):
    pass