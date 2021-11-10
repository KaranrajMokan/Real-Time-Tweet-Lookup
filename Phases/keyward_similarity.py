#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Oct 19 20:39:38 2021

@author: karanrajmokan
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from nltk import word_tokenize          
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english')) 

class LemmaTokenizer:
    ignore_tokens = [',', '.', ';', ':', '"', '``', "''", '`']
    def __init__(self):
        self.wnl = WordNetLemmatizer()
    def __call__(self, doc):
        return [self.wnl.lemmatize(t) for t in word_tokenize(doc) if t not in self.ignore_tokens]


tokenizer=LemmaTokenizer()
token_stop = tokenizer(' '.join(stop_words))

f=open('tweets','r')
tweets = f.readlines()
query = 'tokyo olympics sports'
vectorizer = TfidfVectorizer(stop_words=token_stop,                               tokenizer=tokenizer)
doc_vectors = vectorizer.fit_transform([query] + tweets)
cosine_similarities = linear_kernel(doc_vectors[0:1], doc_vectors).flatten()
document_scores = [item.item() for item in cosine_similarities[1:]]

similarity_dict={}
for i,j in enumerate(document_scores):
    similarity_dict[i]=j
    

sorted_indexes = dict(sorted(similarity_dict.items(), key=lambda item: item[1],reverse=True))
count=0
print("USING KEYWARD SIMILARITY:\n")
for idx in sorted_indexes:
    if count==100:
        break
    print(f'{idx} \t {similarity_dict[idx]:0.3f} \t {tweets[idx]}')
    count+=1
    
