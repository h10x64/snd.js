#!/usr/bin/ruby

require 'cgi'
require 'json'
require File.expand_path('../keygen', __FILE__)

c = CGI.new
input = CGI.unescape(c['code'])

key = []
KeyGenerator.generate(input).each{|num|
    key.push(num.to_s(16))
}

puts(c.header({"status"=>"OK","type"=>"application/json"}))
puts(JSON.generate({"key"=>key.join}))

