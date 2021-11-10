#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Oct 19 20:10:31 2021

@author: karanrajmokan
"""

import gensim.downloader as api
from gensim.corpora import Dictionary
from gensim.models import TfidfModel
from gensim.similarities import WordEmbeddingSimilarityIndex
from gensim.similarities import SparseTermSimilarityMatrix
from gensim.similarities import SoftCosineSimilarity
import numpy as np

f=open('tweets','r')
lines = f.readlines()

tweets=[]
for line in lines:
    string = line.split(" ")
    tweets.append(string)
    
query=['tokyo','olympics','sports']

glove = api.load("glove-wiki-gigaword-50")    
similarity_index = WordEmbeddingSimilarityIndex(glove)

dictionary = Dictionary(tweets+[query])
tfidf = TfidfModel(dictionary=dictionary)

similarity_matrix = SparseTermSimilarityMatrix(similarity_index, dictionary, tfidf)

query_tf = tfidf[dictionary.doc2bow(query)]

index = SoftCosineSimilarity(
            tfidf[[dictionary.doc2bow(document) for document in tweets]],
            similarity_matrix)

doc_similarity_scores = index[query_tf]

sorted_indexes = np.argsort(doc_similarity_scores)[::-1]
count=0
answer=[]
print("\nUSING SEMANTIC SIMILARITY:\n")
for idx in sorted_indexes:
    if count==100:
        break
    answer.append(idx)
    count+=1
    
    
    