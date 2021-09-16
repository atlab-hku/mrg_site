import json
from collections import defaultdict

import nltk
from nltk.corpus import stopwords

def load(filename="photos.json"):
    return json.loads(open(filename).read())

def tokenize(photos):
    results = defaultdict(list)
    for photo in photos:
        title = photo["title"]
        