#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Nov 10 08:52:52 2021

@author: karanrajmokan
"""

from flask import Flask,request
from flask_cors import CORS, cross_origin
import ast
import tweepy as tw
import os
import pandas as pd
import numpy as np
from collections import defaultdict
import gensim.downloader as api
from gensim.corpora import Dictionary
from gensim.models import TfidfModel
from gensim.similarities import WordEmbeddingSimilarityIndex
from gensim.similarities import SparseTermSimilarityMatrix
from gensim.similarities import SoftCosineSimilarity
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from dotenv import load_dotenv
load_dotenv('.env')

tweetID=[]
name=[]
screen_name=[]
profile_image=[]
description=[]
following=[]
followers=[]
full_tweet=[]
likes_count=[]
retweet_count=[]

def preprocessing(tweet):
    for i in range(len(tweet)):
        temp = tweet[i].split()
        for j in range(len(temp)):
            if temp[j].startswith('https://') or temp[j].startswith('@'):
                temp[j]=""
        tweet[i] = " ".join(temp)
        
    return tweet
    

def remove_punctuations(text):
    text=text.lower()
    punc = '''!()-[]{};:'"\,<>./?@#$%^&*_|~'''
    for i in text:
        if i in punc:
            text=text.replace(i,"")
    return text


def remove_emoji(text):
    char_list = [text[j] for j in range(len(text)) if ord(text[j]) in range(65536)]
    text = ''
    for char in char_list:
        text += char
    return text


def remove_numbers(text):
    temp = text.split()
    for i in range(len(temp)):
        if temp[i].isnumeric():
            temp[i]=""
            
    text = " ".join(temp)
    return text


def initialise(data):
    
    api_key=os.environ.get('TWITTER_API_KEY')
    api_secret_key=os.environ.get('TWITTER_API_SECRET_KEY')
    access_token=os.environ.get('TWITTER_ACCESS_TOKEN')
    access_token_secret=os.environ.get('TWITTER_ACCESS_TOKEN_SECRET')
    auth = tw.OAuthHandler(api_key, api_secret_key)
    auth.set_access_token(access_token, access_token_secret)
    api = tw.API(auth, wait_on_rate_limit=True)

    countries = pd.read_csv('location.csv')
    result = countries[countries['name'] == data['country']]
    
    search_words = data['searchText'].split(",")[0]
    language = data['language']
    count = int(data['tweetCount'])*10
    string = "".join(result['latitude'].astype(str) +","+ result['longitude'].astype(str)+",1000km")

    tweets = tw.Cursor(api.search_tweets,tweet_mode="extended",
              q=search_words,
              lang=language,
              geocode=string).items(count)
    
    texts=[]
    for tweet in tweets:
        if tweet.full_text not in texts and tweet.full_text !="":
            name.append(tweet.user.name)
            screen_name.append(tweet.user.screen_name)
            profile_image.append(tweet.user.profile_image_url)
            description.append(tweet.user.description)
            following.append(tweet.user.friends_count)
            followers.append(tweet.user.followers_count)
            full_tweet.append(tweet.full_text)
            texts.append(tweet.full_text)
            tweetID.append(tweet.id)
            likes_count.append(tweet.favorite_count)
            retweet_count.append(tweet.retweet_count)
            
    texts = preprocessing(texts)
    for i in range(len(texts)):
        texts[i] = remove_punctuations(texts[i])
        texts[i] = remove_emoji(texts[i])
        texts[i] = remove_numbers(texts[i])
        text_tokens = word_tokenize(texts[i])
        texts[i] = [word for word in text_tokens if not word in stopwords.words()]        

    return texts


def semantic_similarity(data,tweets):
    
    query = data['searchText'].split(",")
    tweetCount = int(data['tweetCount'])
    
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
    answer=[]
    count=0
    for idx in sorted_indexes:
        if count==tweetCount:
            break
        answer.append(idx)
        count+=1
    
    return answer


def final_computation(answer):
    
    result=defaultdict(lambda:[])
    for i in answer:
        result["name"].append(name[i])
        result["screen_name"].append(screen_name[i])
        result["profile_image_url"].append(profile_image[i])
        result["description"].append(description[i])
        result["following"].append(following[i])
        result["followers"].append(followers[i])
        result["tweet"].append(full_tweet[i])
        result["likes_count"].append(likes_count[i])
        result["retweet_count"].append(retweet_count[i])
        
    return dict(result)


app = Flask(__name__)
CORS(app,resources={r"/*": {"origins": "*"}})

@app.route("/tweets", methods=["POST"], strict_slashes=False)
@cross_origin(supports_credentials=True)
def getTweets():
    data = request.data
    dict_str = data.decode("UTF-8")
    data = ast.literal_eval(dict_str)
    texts = initialise(data)
    answer = semantic_similarity(data,texts)
    result = final_computation(answer)
    return result

if __name__ == "__main__":
    app.run(debug=True)
    
    
    
    
    