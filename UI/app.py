from flask import Flask, render_template, request
import numpy as np
import pickle

model=pickle.load(open('model.pkl','rb'))
print("==== Model Type ====")
print(type(model)) 

app = Flask(__name__)

@app.route('/', methods = ['post', 'get'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST', 'get'])
def predict():
    # Get data from the form
    feature1 = request.form['feature1']
    print(f"Received data: Feature 1 = {feature1}")
    
    def host_length(url):
        count = 0
        f = 0

        for i in range(len(url)):
            if url[i] == "/" and url[i - 1] == "/":
                for j in range(i + 1, len(url)):
                    count += 1
                    if url[j + 1] == "/":
                        f = 1
                        break

        return count


    def count_x(url, x):
        dot_count = url.count(x)
        return dot_count


    def count_num(url):
        digit_count = sum(1 for char in url if char.isdigit())
        return digit_count


    def phis_hints(url):
        x = 0
        x += count_x(url, "wp")
        x += count_x(url, "login")
        x += count_x(url, "includes")
        x += count_x(url, "admin")
        x += count_x(url, "site")
        x += count_x(url, "images")
        x += count_x(url, "js")
        x += count_x(url, "alibaba")
        x += count_x(url, "css")
        x += count_x(url, "myaccount")
        x += count_x(url, "dropbox")
        x += count_x(url, "themes")
        x += count_x(url, "plugins")
        x += count_x(url, "signin")
        x += count_x(url, "view")

        return x


    def analyze_url(curr_url):
        link = curr_url[8:] if curr_url[4] == "s" else curr_url[7:]
        f = 1
        domain = ""
        path = ""
        for i in range(len(link)):
            if f and link[i] == "/":
                f = 0
            if f:
                domain += link[i]
            else:
                path += link[i]

        values = {
            'length_url': len(curr_url),
            'length_hostname': host_length(curr_url),
            'nb_dots': count_x(curr_url, "."),
            'nb_hyphens': count_x(curr_url, "-"),
            'nb_at': count_x(curr_url, "@"),
            'nb_qm': count_x(curr_url, "?"),
            'nb_and': count_x(curr_url, "&"),
            'nb_or': count_x(curr_url, "|"),
            'nb_eq': count_x(curr_url, "="),
            'nb_underscore': count_x(curr_url, "_"),
            'nb_tilde': count_x(curr_url, "~"),
            'nb_percent': count_x(curr_url, "%"),
            'nb_slash': count_x(curr_url, "/"),
            'nb_star': count_x(curr_url, "*"),
            'nb_colon': count_x(curr_url, ":"),
            'nb_comma': count_x(curr_url, ","),
            'nb_semicolon': count_x(curr_url, ";"),
            'nb_dollar': count_x(curr_url, "$"),
            'nb_space': count_x(curr_url, " "),
            'nb_www': count_x(curr_url, "www"),
            'nb_com': count_x(path, "com"),  # in path
            'nb_dslash': count_x(curr_url, "//"),
            'https_token': 0 if curr_url[4] == "s" else 1,  # 0 if "s" is present, else 1
            'ratio_digits_url': count_num(curr_url) / len(curr_url),
            'ratio_digits_host': count_num(domain) / len(domain),
            'prefix_suffix': 0 if count_x(domain, "-") == 0 else 1,
            'path_extension': 1 if any(count_x(curr_url, ext) for ext in ["exe", "txt", "js", "apk"]) else 0,
            'phish_hints': phis_hints(curr_url),
        }
        return values
    values = analyze_url(feature1)
    print((values))
    my_array = np.array(list(values.values()))
    print(my_array)
    my_2d_array = my_array.reshape(1, -1)
    prediction=model.predict_proba(my_2d_array)
    output='{0:.{1}f}'.format(prediction[0][1], 2)
    print("::::::::::::::::::::::::")
    print(output)

   
    if output>=str(0.70):
        return render_template('index.html',pred=f"{output}")
    else:
        return render_template('index.html',pred=f"{output}")

if __name__ == '__main__':
    app.run(debug=True)