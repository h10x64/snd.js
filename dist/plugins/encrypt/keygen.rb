#!/usr/local/bin/ruby 

module KeyGenerator

    def generate(input)
        # キーはIPアドレスから'.'と':'を消して、1文字づつ16進数とした配列
        # 16進数として読めない文字が含まれていた場合はその値はゼロ扱い
        key = []
        input.tr('.:', '').split(//).each{|char|
            key.push(char.hex)
        }
        
        return key
    end

    module_function :generate
end
