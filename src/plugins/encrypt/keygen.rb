#!/usr/local/bin/ruby 

module KeyGenerator

    def generate(input)
        key = []
        input.tr('.:', '').split(//).each{|char|
            key.push(char.hex)
        }
        
        return key
    end

    module_function :generate
end
