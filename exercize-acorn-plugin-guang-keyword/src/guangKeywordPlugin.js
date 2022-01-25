const acorn = require("acorn");

const Parser = acorn.Parser;
const tt = acorn.tokTypes;
const TokenType = acorn.TokenType;

// 注册一个新的 token 类型来标识它
Parser.acorn.keywordTypes["guang"] = new TokenType("guang",{keyword: "guang"});

module.exports = function(Parser) {
    return class extends Parser {
        parse(program) {
            let newKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this const class extends export import super";
            newKeywords += " guang"; // 增加一个关键字
            this.keywords = new RegExp("^(?:" + newKeywords.replace(/ /g, "|") + ")$")
            return(super.parse(program));
        }

        parseStatement(context, topLevel, exports) {
            var starttype = this.type; // 当前处理到的 token 的类型

            if (starttype == Parser.acorn.keywordTypes["guang"]) {
                var node = this.startNode();
                return this.parseGuangStatement(node);
            }
            else {
                return(super.parseStatement(context, topLevel, exports)); // 不是我们扩展的 token，则调用父类的 parseStatement 处理
            }
        }

        parseGuangStatement(node) {
            this.next(); //  this.next 是消费这个 token
            return this.finishNode({value: 'guang'},'GuangStatement'); // 新增加的ssh语句
        };
    }
}
