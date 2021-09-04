#!/bin/bash

memcached -u winds -d
hypercorn app:app --bind backend