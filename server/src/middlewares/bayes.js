function bayes(str, filter_level, spam_param, ham_param, spam_list, ham_list) {
    
    var spam_amm = spam_param.amm;
    var spam_freq = spam_list;
    
    var ham_amm = ham_param.amm;
    var ham_freq = ham_list;
    str = str.replace(/[^a-zA-Z ]/g, "")
    var ar = str.split(' ');
    var i;

    var p_spam = 0
    var p_ham = 0

    for (var i = 0; i < ar.length; i++) {
        var word = ar[i];
               
        if(!(word in spam_freq)){
            spam_freq[word] = 0;
        }
        
        if(!(word in ham_freq)){
            ham_freq[word] = 0;
        }
        
        var chance_spam = spam_freq[word] / spam_amm
        var chance_ham = ham_freq[word] / ham_amm
        var ilość_maili = spam_amm + ham_amm            
        
        if (chance_spam != 0) {
            p_spam += (chance_spam * spam_amm / ilość_maili) / ((chance_spam * spam_amm / ilość_maili) + (chance_spam * spam_amm / ilość_maili) + (chance_ham * spam_amm / ilość_maili))
        }
        
        if (chance_ham != 0) {
            p_ham += (chance_ham * ham_amm / ilość_maili) / ((chance_ham * ham_amm / ilość_maili) + (chance_ham * ham_amm / ilość_maili) + (chance_spam * spam_amm / ilość_maili))
        }
    }
        
    if (p_spam + filter_level/5 >  (p_ham)) {
        return '1'
    }

    return '0'    
}

module.exports = bayes;
