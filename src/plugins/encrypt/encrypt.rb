#!/usr/bin/ruby

require 'cgi'
require 'pathname'
require File.expand_path('../keygen', __FILE__)

# 音源ファイルが配置されるルートパス(環境に合わせて書き換えてください)
# JavaScript側で
#   snd.AUDIO_DATA_MANAGER.addEncryptSource("foo", "./sound/bar.mp3");
# のように書いた場合、 "%SOUND_DIR_PATH%./sound/bar.mp3" を取得しようとします。
# （ファイルが無い場合は403 FORBIDDEN。 SOUND_DIR_PATH以降で "../" は使用不可。）
SOUND_DIR_PATH = "/please/rewrite/this/path/"

BASE64ENCODE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/']
BASE64DECODE = {'A'=> 0, 'B'=> 1, 'C'=> 2, 'D'=> 3, 'E'=> 4, 'F'=> 5, 'G'=> 6, 'H'=> 7, 'I'=> 8, 'J'=> 9, 'K'=> 10, 'L'=> 11, 'M'=> 12, 'N'=> 13, 'O'=> 14, 'P'=> 15, 'Q'=> 16, 'R'=> 17, 'S'=> 18, 'T'=> 19, 'U'=> 20, 'V'=> 21, 'W'=> 22, 'X'=> 23, 'Y'=> 24, 'Z'=> 25, 'a'=> 26, 'b'=> 27, 'c'=> 28, 'd'=> 29, 'e'=> 30, 'f'=> 31, 'g'=> 32, 'h'=> 33, 'i'=> 34, 'j'=> 35, 'k'=> 36, 'l'=> 37, 'm'=> 38, 'n'=> 39, 'o'=> 40, 'p'=> 41, 'q'=> 42, 'r'=> 43, 's'=> 44, 't'=> 45, 'u'=> 46, 'v'=> 47, 'w'=> 48, 'x'=> 49, 'y'=> 50, 'z'=> 51, '0'=> 52, '1'=> 53, '2'=> 54, '3'=> 55, '4'=> 56, '5'=> 57, '6'=> 58, '7'=> 59, '8'=> 60, '9'=> 61, '+'=> 62, '/'=> 63}

c = CGI.new

addr = c.remote_addr.to_s

dataHeader = addr + '|'

key = KeyGenerator.generate(addr)

fileName = c["file"]
fileName.gsub!("../", "")
fileName.insert(0, SOUND_DIR_PATH)

if ( fileName == SOUND_DIR_PATH || !File.exist?(fileName) ) then
    puts(c.header({"status"=>"FORBIDDEN", "type"=>"text/plain"}))
    puts("403 FORBIDDEN")
else
    res = ""
    
    begin
        file = open(fileName, "rb")
        base64Data = [file.read].pack('m')
        file.close
        
        decode = []
        base64Data.split(//).each{|char|
            if (char == '=') then
                decode.push(-1)
            elsif (char == '\n') then
                decode.push(-2)
            else
                decode.push(BASE64DECODE[char])
            end
        }
        
        counter = 0
        encode = []
        decode.each{|num|
            if (num) then
                if (num < 0) then
                    if (num == -1) then
                        encode.push('=')
                    elsif (num == -2) then
                        encode.push('\n')
                    end
                else
                    encode.push(BASE64ENCODE[ (num + key[counter]) % (BASE64ENCODE.length) ] )
                    counter += 1
                    counter = counter % (key.length)
                end
            end
        }
        
        res = dataHeader + encode.join
    rescue => e
        puts(c.header({"status"=>"SERVER_ERROR", "type"=>"text/plain"}))
        puts("500 ERROR")
    end
    
    puts(c.header({"status"=>"OK", "type"=>"text/plain"}))
    puts res
end


