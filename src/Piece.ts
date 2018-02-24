import Color from "./Color";
import MoveDefinition from "./MoveDefinition";

export default class Piece{
    color: Color; // 先後
    kind: string; // 駒の種類
    // "+FU"などのCSAによる駒表現から駒オブジェクトを作成
    constructor(csa: string){
        this.color = csa.slice(0, 1)=="+" ? Color.Black : Color.White;
        this.kind = csa.slice(1);
    }
    // 成る
    promote(): void{
        this.kind = Piece.promote(this.kind);
    }
    // 不成にする
    unpromote(): void{
        this.kind = Piece.unpromote(this.kind);
    }
    // 駒の向きを反転する
    inverse(): void{
        this.color = this.color==Color.Black ? Color.White : Color.Black;
    }
    // CSAによる駒表現の文字列を返す
    toCSAString(): string{
        return (this.color==Color.Black ? "+" : "-")+this.kind;
    }
    // SFENによる駒表現の文字列を返す
    toSFENString(): string{
        var sfenPiece = {
            FU: "P", // Pawn
            KY: "L", // Lance
            KE: "N", // kNight
            GI: "S", // Silver
            KI: "G", // Gold
            KA: "B", // Bishop
            HI: "R", // Rook
            OU: "K", // King
        }[Piece.unpromote(this.kind)];
        return (Piece.isPromoted(this.kind) ? "+" : "") +
            (this.color==Color.Black ? sfenPiece : sfenPiece.toLowerCase());
    }
    // 成った時の種類を返す．なければそのまま．
    static promote(kind: string): string{
        return {
            FU: "TO",
            KY: "NY",
            KE: "NK",
            GI: "NG",
            KA: "UM",
            HI: "RY",
        }[kind] || kind;
    }
    // 表に返した時の種類を返す．表の場合はそのまま．
    static unpromote(kind: string): string{
        return {
            TO: "FU",
            NY: "KY",
            NK: "KE",
            NG: "GI",
            KI: "KI",
            UM: "KA",
            RY: "HI",
            OU: "OU",
        }[kind] || kind;
    }
    // 成れる駒かどうかを返す
    static canPromote(kind: string): boolean{
        return Piece.promote(kind)!=kind;
    }
    static getMoveDef(kind: string): MoveDefinition{
        switch(kind){
            case "FU":
                return {just:[[0,-1],]};
            case "KY":
                return {fly:[[0,-1],]};
            case "KE":
                return {just:[[-1,-2],[1,-2],]};
            case "GI":
                return {just:[[-1,-1],[0,-1],[1,-1],[-1,1],[1,1],]};
            case "KI": case "TO": case "NY": case "NK": case "NG":
            return {just:[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[0,1]]};
            case "KA":
                return {fly:[[-1,-1],[1,-1],[-1,1],[1,1],]};
            case "HI":
                return {fly:[[0,-1],[-1,0],[1,0],[0,1]]};
            case "OU":
                return {just:[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]]};
            case "UM":
                return {fly:[[-1,-1],[1,-1],[-1,1],[1,1],],just:[[0,-1],[-1,0],[1,0],[0,1]]};
            case "RY":
                return {fly:[[0,-1],[-1,0],[1,0],[0,1]], just:[[-1,-1],[1,-1],[-1,1],[1,1],]};
        }
    }
    static isPromoted(kind: string): boolean{
        return ["TO","NY","NK","NG","UM","RY"].indexOf(kind)>=0;
    }
    static oppositeColor(color: Color): Color{
        return color==Color.Black ? Color.White : Color.Black;
    }
    // SFENによる文字列表現から駒オブジェクトを作成
    static fromSFENString(sfen: string): Piece{
        var promoted = sfen[0]=="+";
        if (promoted){
            sfen = sfen.slice(1);
        }
        var color = sfen.match(/[A-Z]/) ? "+" : "-";
        var kind = {
            P: "FU",
            L: "KY",
            N: "KE",
            S: "GI",
            G: "KI",
            B: "KA",
            R: "HI",
            K: "OU",
        }[sfen.toUpperCase()];
        var piece = new Piece(color + kind);
        if (promoted){
            piece.promote();
        }
        return piece;
    }
}
