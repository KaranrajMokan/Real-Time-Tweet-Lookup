#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Sep 22 15:10:24 2021

@author: karanrajmokan
"""

import tweepy as tw
import os
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from dotenv import load_dotenv
load_dotenv('.env')

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


api_key=os.environ.get('TWITTER_API_KEY')
api_secret_key=os.environ.get('TWITTER_API_SECRET_KEY')
bearer_token=os.environ.get('TWITTER_BEARER_TOKEN')
access_token=os.environ.get('TWITTER_ACCESS_TOKEN')
access_token_secret=os.environ.get('TWITTER_ACCESS_TOKEN_SECRET')
auth = tw.OAuthHandler(api_key, api_secret_key)
auth.set_access_token(access_token, access_token_secret)
api = tw.API(auth, wait_on_rate_limit=True)

search_words = "Olympics"
date_since = "2021-09-21"

tweets = tw.Cursor(api.search,tweet_mode="extended",
              q=search_words,
              lang="en",
              geocode="20.5937,78.9629,3287263km",
              since=date_since).items(20)

texts=[]
mentions=[]
twitterURLs=[]
tweetID=[]
for tweet in tweets:
    texts.append(tweet.full_text)
    mentions.append(tweet.entities['user_mentions'])
    twitterURLs.append(tweet.entities['urls'])
    tweetID.append(tweet.id)


texts = preprocessing(texts)
for i in range(len(texts)):
    texts[i] = remove_punctuations(texts[i])
    texts[i] = remove_emoji(texts[i])
    texts[i] = remove_numbers(texts[i])
    text_tokens = word_tokenize(texts[i])
    texts[i] = [word for word in text_tokens if not word in stopwords.words()]

'''
for i in texts:
    print(i)
    print("\n\n")
'''

total_tokens=[]
for i in range(len(texts)):
    for j in texts[i]:
        if j not in total_tokens:
            total_tokens.append(j)
            
print("The length of terms is",len(total_tokens))
 
termDict={}
for i in total_tokens:
    temp=[]
    for j in range(len(texts)):
        if i in texts[j]:
            temp.append(j+1)
    termDict[i]=temp
 
print(termDict)


'''

# id => twitter id
# retweet_count => retweets
# favorite_count => likes
# description => profile description
# followers_count => followers
# friends_count => following
# profile_image_url => image
# name => actual name
# screen_name => profile name

print(tweet.id)
print(tweet.text)
print(tweet.user.description)
print(tweet.user.followers_count)
print(tweet.user.friends_count)
print(tweet.user.profile_image_url)
print(tweet.user.name)
print(tweet.user.screen_name)
print("\n")

url = "https://api.twitter.com/2/tweets?ids=1440617674761859089&tweet.fields=public_metrics&expansions=attachments.media_keys&media.fields=public_metrics"
headers={'Authorization':'Bearer '+bearer_token}

resp = requests.get(url,headers=headers)
r = resp.json()
print(r['data'])

'''

