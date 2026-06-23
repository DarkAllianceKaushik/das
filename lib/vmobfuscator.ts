function randomName(length = 8): string {
  const c = "IlO01lLoO0IlO01lL";
  let r = "_";
  for (let i = 0; i < length; i++) r += c[Math.floor(Math.random() * c.length)];
  return r;
}

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

function splitForLua(s: string, sz: number): string {
  const p: string[] = [];
  for (let i = 0; i < s.length; i += sz) p.push(s.slice(i, i + sz));
  return p.map(x => `"${x}"`).join("..");
}

function xorEnc(s: string, k: string): string {
  let r = "";
  for (let i = 0; i < s.length; i++) r += String.fromCharCode(s.charCodeAt(i) ^ k.charCodeAt(i % k.length));
  return btoa(r);
}

function xorDecLua(enc: string, key: string): string {
  return `(function() local k="${key}" local d=${splitForLua(enc, 60)} local r="" for i=1,#d do r=r..string.char(d:byte(i)~=k:byte((i-1)%#k+1)) end return r end)()`;
}

/* ========== TOKENIZER ========== */

const KW = new Set(["and","break","do","else","elseif","end","false","for","function","goto","if","in","local","nil","not","or","repeat","return","then","true","until","while"]);

type Tok = { t: string; v?: any; line: number };

function tokenize(src: string): Tok[] {
  const ts: Tok[] = [];
  let i = 0, line = 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\n") { line++; i++; continue; }
    if (ch === " " || ch === "\t" || ch === "\r") { i++; continue; }
    if (ch === "-" && src[i + 1] === "-") {
      if (src[i + 2] === "[" && src[i + 3] === "[") { const end = src.indexOf("]]", i + 4); i = end === -1 ? src.length : end + 2; }
      else { const nl = src.indexOf("\n", i); i = nl === -1 ? src.length : nl; }
      continue;
    }
    if ((ch === "[" && src[i + 1] === "[") || (ch === "[" && src[i + 1] === "=")) {
      let eq = 0; while (src[i + 1 + eq] === "=") eq++;
      const close = "]" + "=".repeat(eq) + "]";
      const end = src.indexOf(close, i + 2 + eq);
      ts.push({ t: "string", v: src.slice(i + 2 + eq, end === -1 ? src.length : end), line });
      i = end === -1 ? src.length : end + close.length;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let s = "", j = i + 1;
      while (j < src.length && src[j] !== ch) { if (src[j] === "\\" && j + 1 < src.length) { s += src[j + 1]; j += 2; } else { s += src[j]; j++; } }
      ts.push({ t: "string", v: s, line }); i = j + 1;
      continue;
    }
    if (ch >= "0" && ch <= "9") {
      let n = "";
      while (i < src.length && ((src[i] >= "0" && src[i] <= "9") || src[i] === "." || src[i] === "x" || src[i] === "X" || (src[i] >= "a" && src[i] <= "f") || (src[i] >= "A" && src[i] <= "F"))) { n += src[i]; i++; }
      ts.push({ t: "number", v: parseFloat(n) || 0, line }); continue;
    }
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_") {
      let w = "";
      while (i < src.length && ((src[i] >= "a" && src[i] <= "z") || (src[i] >= "A" && src[i] <= "Z") || (src[i] >= "0" && src[i] <= "9") || src[i] === "_")) { w += src[i]; i++; }
      ts.push({ t: KW.has(w) ? w : "id", v: w, line }); continue;
    }
    const pairs: [string, string][] = [
      ["..",".."],["...","..."],["==","=="],["~=","~="],[">=",">="],["<=","<="],
      ["+","+"],["-","-"],["*","*"],["/","/"],["^","^"],["%","%"],["#","#"],
      ["=","="],["<","<"],[">",">"],["(","("],[")",")"],["{","{"],["}","}"],["[","["],["]","]"],
      [",",","],[";",";"],[":",":"],[".","."],
    ];
    let matched = false;
    for (const [p, t] of pairs) { if (src.slice(i, i + p.length) === p) { ts.push({ t, line }); i += p.length; matched = true; break; } }
    if (matched) continue;
    i++;
  }
  ts.push({ t: "EOF", line });
  return ts;
}

/* ========== PARSER ========== */

type Expr = { k: string; [k: string]: any };
type Stmt = { k: string; [k: string]: any };

class Parser {
  ts: Tok[]; pos = 0;
  constructor(ts: Tok[]) { this.ts = ts; }
  peek(): Tok { return this.ts[this.pos] || { t: "EOF", line: 0 }; }
  eat(t?: string): Tok {
    const tk = this.peek();
    if (t && tk.t !== t) throw new Error(`Line ${tk.line}: expected ${t}, got ${tk.t}`);
    this.pos++; return tk;
  }
  tryEat(...ts: string[]): Tok | null {
    const tk = this.peek();
    for (const t of ts) { if (tk.t === t) { this.pos++; return tk; } }
    return null;
  }
  parse(): Stmt[] { const s: Stmt[] = []; while (this.peek().t !== "EOF") { const st = this.stmt(); if (st) s.push(st); this.tryEat(";"); } return s; }
  stmt(): Stmt | null {
    const tk = this.peek().t;
    if (tk === "local") return this.parseLocal();
    if (tk === "function") return this.parseFuncDecl();
    if (tk === "if") return this.parseIf();
    if (tk === "while") return this.parseWhile();
    if (tk === "for") return this.parseFor();
    if (tk === "repeat") return this.parseRepeat();
    if (tk === "return") { this.eat("return"); const v = this.parseExprList(); return { k: "return", v }; }
    if (tk === "break") { this.eat("break"); return { k: "break" }; }
    if (tk === "EOF" || tk === "end" || tk === "else" || tk === "elseif" || tk === "until") return null;
    return this.parseAssignOrCall();
  }
  parseLocal(): Stmt {
    this.eat("local"); const names: string[] = [this.eat("id").v];
    while (this.tryEat(",")) names.push(this.eat("id").v);
    let vals: Expr[] = [];
    if (this.tryEat("=")) vals = this.parseExprList();
    return { k: "local", names, vals };
  }
  parseFuncDecl(): Stmt {
    this.eat("function"); const name = this.eat("id").v;
    this.eat("("); const params: string[] = [];
    if (this.peek().t !== ")") { params.push(this.eat("id").v); while (this.tryEat(",")) params.push(this.eat("id").v); }
    this.eat(")"); const body = this.parseBlock("end"); this.eat("end");
    return { k: "function", name, params, body };
  }
  parseIf(): Stmt {
    this.eat("if"); const cond = this.parseExpr(); this.eat("then");
    const thenB = this.parseBlock("elseif","else","end");
    const elseif: { cond: Expr; body: Stmt[] }[] = [];
    while (this.peek().t === "elseif") { this.eat("elseif"); const c = this.parseExpr(); this.eat("then"); const b = this.parseBlock("elseif","else","end"); elseif.push({ cond: c, body: b }); }
    let elseB: Stmt[] = [];
    if (this.tryEat("else")) elseB = this.parseBlock("end");
    this.eat("end");
    return { k: "if", cond, then: thenB, elseif, else: elseB };
  }
  parseWhile(): Stmt { this.eat("while"); const cond = this.parseExpr(); this.eat("do"); const body = this.parseBlock("end"); this.eat("end"); return { k: "while", cond, body }; }
  parseFor(): Stmt {
    this.eat("for"); const v1 = this.eat("id").v;
    if (this.tryEat("=")) {
      const start = this.parseExpr(); this.eat(","); const end = this.parseExpr();
      let step: Expr | null = null; if (this.tryEat(",")) step = this.parseExpr();
      this.eat("do"); const body = this.parseBlock("end"); this.eat("end");
      return { k: "for", var: v1, start, end, step, body };
    }
    const vars = [v1]; while (this.tryEat(",")) vars.push(this.eat("id").v);
    this.eat("in"); const iter = this.parseExpr(); this.eat("do"); const body = this.parseBlock("end"); this.eat("end");
    return { k: "forin", vars, iter, body };
  }
  parseRepeat(): Stmt { this.eat("repeat"); const body = this.parseBlock("until"); this.eat("until"); const cond = this.parseExpr(); return { k: "repeat", body, cond }; }
  parseBlock(...terminators: string[]): Stmt[] { const s: Stmt[] = []; while (true) { const tk = this.peek().t; if (tk === "EOF" || terminators.includes(tk)) break; const st = this.stmt(); if (st) s.push(st); this.tryEat(";"); } return s; }
  parseAssignOrCall(): Stmt {
    const lhs = this.parsePrefixExpr();
    if (this.tryEat("=")) { const vals = this.parseExprList(); return { k: "assign", lhs: [lhs], vals }; }
    if (this.tryEat(",")) {
      const lhss: Expr[] = [lhs]; do { lhss.push(this.parsePrefixExpr()); } while (this.tryEat(","));
      this.eat("="); const vals = this.parseExprList(); return { k: "assign", lhs: lhss, vals };
    }
    return { k: "call", expr: lhs };
  }
  parseExprList(): Expr[] { const e: Expr[] = [this.parseExpr()]; while (this.tryEat(",")) e.push(this.parseExpr()); return e; }
  parseExpr(): Expr { return this.parseOr(); }
  parseOr(): Expr { let e = this.parseAnd(); while (this.tryEat("or")) { const r = this.parseAnd(); e = { k: "binop", op: "or", l: e, r }; } return e; }
  parseAnd(): Expr { let e = this.parseRel(); while (this.tryEat("and")) { const r = this.parseRel(); e = { k: "binop", op: "and", l: e, r }; } return e; }
  parseRel(): Expr { let e = this.parseConcat(); const cmp = this.tryEat("==","~=","<",">","<=",">="); if (cmp) { const r = this.parseConcat(); e = { k: "binop", op: cmp.t, l: e, r }; } return e; }
  parseConcat(): Expr { let e = this.parseAdd(); while (this.tryEat("..")) { const r = this.parseAdd(); e = { k: "binop", op: "..", l: e, r }; } return e; }
  parseAdd(): Expr { let e = this.parseMul(); while (true) { const op = this.tryEat("+","-"); if (!op) break; const r = this.parseMul(); e = { k: "binop", op: op.t, l: e, r }; } return e; }
  parseMul(): Expr { let e = this.parseUnary(); while (true) { const op = this.tryEat("*","/","%","^"); if (!op) break; const r = this.parseUnary(); e = { k: "binop", op: op.t, l: e, r }; } return e; }
  parseUnary(): Expr { const op = this.tryEat("-","not","#"); if (op) return { k: "unary", op: op.t, v: this.parseUnary() }; return this.parseSuffix(); }
  parseSuffix(): Expr {
    let e = this.parsePrefixExpr();
    while (true) {
      if (this.tryEat("[")) { const k = this.parseExpr(); this.eat("]"); e = { k: "index", obj: e, key: k }; }
      else if (this.tryEat(".")) { const n = this.eat("id"); e = { k: "index", obj: e, key: { k: "string", v: n.v } }; }
      else if (this.tryEat(":")) { const n = this.eat("id").v; this.eat("("); const args = this.peek().t !== ")" ? this.parseExprList() : []; this.eat(")"); e = { k: "call", func: { k: "index", obj: e, key: { k: "string", v: n } }, args }; }
      else if (this.tryEat("(")) { const args = this.peek().t !== ")" ? this.parseExprList() : []; this.eat(")"); e = { k: "call", func: e, args }; }
      else if (this.tryEat("{")) { e = { k: "call", func: e, args: [this.parseTable()] }; }
      else break;
    }
    return e;
  }
  parseTable(): Expr {
    const fields: { k?: string; v: Expr }[] = [];
    while (this.peek().t !== "}") {
      if (this.tryEat("}")) break;
      if (this.tryEat("[")) { const k = this.parseExpr(); this.eat("]"); this.eat("="); fields.push({ k: undefined, v: this.parseExpr() }); }
      else { const n = this.peek(); if (n.t === "id" && this.ts[this.pos + 1]?.t === "=") { const nk = this.eat("id").v; this.eat("="); fields.push({ k: nk, v: this.parseExpr() }); } else fields.push({ k: undefined, v: this.parseExpr() }); }
      this.tryEat(",");
    }
    this.eat("}"); return { k: "table", fields };
  }
  parsePrefixExpr(): Expr {
    const tk = this.peek();
    if (tk.t === "(") { this.eat("("); const e = this.parseExpr(); this.eat(")"); return e; }
    if (tk.t === "nil") { this.eat("nil"); return { k: "nil" }; }
    if (tk.t === "true") { this.eat("true"); return { k: "bool", v: true }; }
    if (tk.t === "false") { this.eat("false"); return { k: "bool", v: false }; }
    if (tk.t === "number") { this.eat("number"); return { k: "num", v: tk.v }; }
    if (tk.t === "string") { this.eat("string"); return { k: "string", v: tk.v }; }
    if (tk.t === "id" || tk.t === "...") { this.eat(tk.t); return { k: tk.t === "..." ? "vararg" : "id", v: tk.v }; }
    if (tk.t === "{") return this.parseTable();
    throw new Error(`Line ${tk.line}: unexpected '${tk.t}'`);
  }
}

/* ========== BYTECODE ========== */

const enum Op {
  NOP,PUSHNIL,PUSHBOOL,PUSHNUM,PUSHSTR,LOADGLOB,SETGLOB,LOADLOC,SETLOC,
  ADD,SUB,MUL,DIV,MOD,POW,CONCAT,EQ,NEQ,LT,GT,LE,GE,
  NOT,NEG,LEN,NEWTABLE,SETTABLE,GETTABLE,CALL,RET,JMP,JMPF,JMPT,NEWCLOSURE,POP,DUP,
}

type Instr = { op: Op; a?: number; b?: number; c?: number };

class Compiler {
  consts: any[] = [];
  locals: string[][] = [];
  proto: { instrs: Instr[]; consts: any[]; params: number; name: string }[] = [];
  curProto = 0;
  loopStack: { breakJmps: number[] }[] = [];

  addConst(v: any): number {
    for (const [i, c] of Array.from(this.consts.entries())) if (JSON.stringify(c) === JSON.stringify(v)) return i;
    this.consts.push(v); return this.consts.length - 1;
  }
  emit(op: Op, a?: number, b?: number, c?: number) { this.proto[this.curProto].instrs.push({ op, a, b, c }); }
  enterProto(name: string, params: number) {
    this.proto.push({ instrs: [], consts: [], params, name });
    this.curProto = this.proto.length - 1;
    this.locals.push([]);
  }
  leaveProto(): number {
    const idx = this.curProto;
    this.proto[idx].consts = [...this.consts];
    this.locals.pop();
    this.curProto = Math.max(0, this.proto.length - 2);
    return idx;
  }
  addLocal(name: string) { this.locals[this.curProto].push(name); }
  findLocal(name: string, pIdx: number): { type: "local"; idx: number } | null {
    for (let p = pIdx; p >= 0; p--) { const idx = this.locals[p]?.indexOf(name); if (idx !== undefined && idx >= 0) return { type: "local", idx }; }
    return null;
  }
  compile(stmts: Stmt[]): number {
    this.enterProto("main", 0);
    for (const s of stmts) this.compileStmt(s);
    this.emit(Op.RET);
    return this.leaveProto();
  }
  compileStmt(s: Stmt) {
    if (!s) return;
    switch (s.k) {
      case "local": {
        for (const n of s.names) this.addLocal(n);
        for (let i = 0; i < s.vals.length; i++) { this.compileExpr(s.vals[i]); if (i < s.names.length) { this.emit(Op.SETLOC, this.locals[this.curProto].indexOf(s.names[i])); this.emit(Op.POP); } }
        for (let i = s.vals.length; i < s.names.length; i++) { this.emit(Op.PUSHNIL); this.emit(Op.SETLOC, this.locals[this.curProto].indexOf(s.names[i])); this.emit(Op.POP); }
        break;
      }
      case "assign": {
        for (const v of s.vals) this.compileExpr(v);
        for (let i = s.vals.length; i < s.lhs.length; i++) this.emit(Op.PUSHNIL);
        for (let i = s.lhs.length - 1; i >= 0; i--) this.compileAssignTarget(s.lhs[i]);
        break;
      }
      case "call": this.compileExpr(s.expr); this.emit(Op.POP); break;
      case "if": {
        this.compileExpr(s.cond); const jf = this.emitJmpF();
        for (const ss of s.then) this.compileStmt(ss);
        const toEnd: number[] = []; const je = this.emitJmp(); this.patchJmp(jf);
        for (const ei of s.elseif) { this.compileExpr(ei.cond); const jf2 = this.emitJmpF(); for (const ss of ei.body) this.compileStmt(ss); const je2 = this.emitJmp(); this.patchJmp(jf2); toEnd.push(je2); }
        for (const ss of s.else) this.compileStmt(ss); this.patchJmp(je);
        for (const j of toEnd) this.patchJmp(j);
        break;
      }
      case "while": {
        const top = this.proto[this.curProto].instrs.length; this.compileExpr(s.cond); const jf = this.emitJmpF();
        this.loopStack.push({ breakJmps: [] });
        for (const ss of s.body) this.compileStmt(ss);
        this.loopStack.pop();
        this.emit(Op.JMP, top); this.patchJmp(jf);
        break;
      }
      case "for": {
        this.compileExpr(s.start); this.compileExpr(s.end); this.compileExpr(s.step || { k: "num", v: 1 });
        const lvIdx = this.locals[this.curProto].length; this.addLocal(s.var); this.addLocal("_fe"); this.addLocal("_fs");
        this.emit(Op.SETLOC, lvIdx + 2); this.emit(Op.POP); this.emit(Op.SETLOC, lvIdx + 1); this.emit(Op.POP); this.emit(Op.SETLOC, lvIdx); this.emit(Op.POP);
        const top = this.proto[this.curProto].instrs.length; this.emit(Op.LOADLOC, lvIdx); this.emit(Op.LOADLOC, lvIdx + 1); this.emit(Op.LE); const jf = this.emitJmpF();
        this.loopStack.push({ breakJmps: [] });
        for (const ss of s.body) this.compileStmt(ss);
        this.loopStack.pop();
        this.emit(Op.LOADLOC, lvIdx); this.emit(Op.LOADLOC, lvIdx + 2); this.emit(Op.ADD); this.emit(Op.SETLOC, lvIdx); this.emit(Op.POP); this.emit(Op.JMP, top); this.patchJmp(jf);
        break;
      }
      case "forin": {
        this.compileExpr(s.iter);
        const itIdx = this.locals[this.curProto].length; this.addLocal("_fg"); this.addLocal("_fs"); this.addLocal("_fc");
        this.emit(Op.SETLOC, itIdx + 2); this.emit(Op.POP); this.emit(Op.SETLOC, itIdx + 1); this.emit(Op.POP); this.emit(Op.SETLOC, itIdx); this.emit(Op.POP);
        const top = this.proto[this.curProto].instrs.length;
        this.emit(Op.LOADLOC, itIdx); this.emit(Op.LOADLOC, itIdx + 1); this.emit(Op.LOADLOC, itIdx + 2); this.emit(Op.CALL, 2);
        const vIdx = this.locals[this.curProto].length; for (const v of s.vars) this.addLocal(v);
        for (let i = 0; i < s.vars.length; i++) { this.emit(Op.SETLOC, vIdx + i); this.emit(Op.POP); }
        const jf = this.emitJmpF();
        this.loopStack.push({ breakJmps: [] }); for (const ss of s.body) this.compileStmt(ss); this.loopStack.pop();
        this.emit(Op.JMP, top); this.patchJmp(jf);
        break;
      }
      case "repeat": {
        const top = this.proto[this.curProto].instrs.length;
        this.loopStack.push({ breakJmps: [] }); for (const ss of s.body) this.compileStmt(ss); this.loopStack.pop();
        this.compileExpr(s.cond); this.emit(Op.JMPF, top);
        break;
      }
      case "return": { for (const e of s.v) this.compileExpr(e); if (s.v.length === 0) this.emit(Op.PUSHNIL); this.emit(Op.RET); break; }
      case "break": { if (this.loopStack.length > 0) this.loopStack[this.loopStack.length - 1].breakJmps.push(this.emitJmp()); break; }
      case "function": {
        this.enterProto(s.name, s.params.length);
        for (const p of s.params) this.addLocal(p); for (const ss of s.body) this.compileStmt(ss); this.emit(Op.RET);
        const idx = this.leaveProto();
        this.emit(Op.NEWCLOSURE, idx); this.emit(Op.SETGLOB, this.addConst(s.name)); this.emit(Op.POP);
        break;
      }
    }
  }
  emitJmp(): number { const idx = this.proto[this.curProto].instrs.length; this.emit(Op.JMP, 0); return idx; }
  emitJmpF(): number { const idx = this.proto[this.curProto].instrs.length; this.emit(Op.JMPF, 0); return idx; }
  emitJmpT(): number { const idx = this.proto[this.curProto].instrs.length; this.emit(Op.JMPT, 0); return idx; }
  patchJmp(idx: number) { this.proto[this.curProto].instrs[idx].a = this.proto[this.curProto].instrs.length; }
  compileAssignTarget(e: Expr) {
    if (e.k === "id") { const loc = this.findLocal(e.v, this.curProto); if (loc) { this.emit(Op.SETLOC, loc.idx); this.emit(Op.POP); } else { this.emit(Op.SETGLOB, this.addConst(e.v)); this.emit(Op.POP); } }
    else if (e.k === "index") { this.compileExpr(e.obj); if (e.key) this.compileExpr(e.key); else this.emit(Op.PUSHNIL); this.emit(Op.SETTABLE); }
  }
  compileExpr(e: Expr) {
    if (!e) { this.emit(Op.PUSHNIL); return; }
    switch (e.k) {
      case "nil": this.emit(Op.PUSHNIL); break;
      case "bool": this.emit(Op.PUSHBOOL, e.v ? 1 : 0); break;
      case "num": this.emit(Op.PUSHNUM, e.v); break;
      case "string": this.emit(Op.PUSHSTR, this.addConst(e.v)); break;
      case "id": { const loc = this.findLocal(e.v, this.curProto); if (loc) this.emit(Op.LOADLOC, loc.idx); else this.emit(Op.LOADGLOB, this.addConst(e.v)); break; }
      case "vararg": this.emit(Op.LOADGLOB, this.addConst("...")); break;
      case "unary": { this.compileExpr(e.v); if (e.op === "-") this.emit(Op.NEG); else if (e.op === "not") this.emit(Op.NOT); else if (e.op === "#") this.emit(Op.LEN); break; }
      case "binop": {
        this.compileExpr(e.l); this.compileExpr(e.r);
        const m: Record<string, Op> = { "+":Op.ADD, "-":Op.SUB, "*":Op.MUL, "/":Op.DIV, "%":Op.MOD, "^":Op.POW, "..":Op.CONCAT, "==":Op.EQ, "~=":Op.NEQ, "<":Op.LT, ">":Op.GT, "<=":Op.LE, ">=":Op.GE };
        if (e.op === "and") { const jf = this.emitJmpF(); this.emit(Op.POP); this.compileExpr(e.r); const je = this.emitJmp(); this.patchJmp(jf); this.patchJmp(je); }
        else if (e.op === "or") { const jt = this.emitJmpT(); this.emit(Op.POP); this.compileExpr(e.r); const je = this.emitJmp(); this.patchJmp(jt); this.patchJmp(je); }
        else this.emit(m[e.op] || Op.ADD);
        break;
      }
      case "index": this.compileExpr(e.obj); this.compileExpr(e.key); this.emit(Op.GETTABLE); break;
      case "call": { this.compileExpr(e.func); for (const a of e.args || []) this.compileExpr(a); this.emit(Op.CALL, e.args?.length || 0); break; }
      case "table": {
        this.emit(Op.NEWTABLE);
        if (e.fields) { for (const f of e.fields) { this.emit(Op.DUP); if (f.k !== undefined) this.emit(Op.PUSHSTR, this.addConst(f.k)); else this.emit(Op.PUSHNUM, 0); this.compileExpr(f.v); this.emit(Op.SETTABLE); } }
        break;
      }
      default: this.emit(Op.PUSHNIL);
    }
  }
}

/* ========== VM GENERATOR ========== */

function numEncode(n: number): string {
  const a = Math.floor(Math.random() * 50 + 2);
  return `(${a * n}/${a})`;
}

function opLua(op: Op, s: string, a: string, c: string, p: string, e: string, pc: string): string {
  const pop = "table.remove"; const push = "table.insert";
  const R = (n: string) => `local _b=${pop}(${s}) local _a=${pop}(${s}) ${push}(${s},_a${n}_b)`;
  const C = (n: string) => `local _b=${pop}(${s}) local _a=${pop}(${s}) ${push}(${s},_a${n}_b)`;
  switch (op) {
    case Op.PUSHNIL: return `${push}(${s},nil)`;
    case Op.PUSHBOOL: return `${push}(${s},${a}==1)`;
    case Op.PUSHNUM: return `${push}(${s},${numEncode(1)}*${a})`;
    case Op.PUSHSTR: return `${push}(${s},${c}[${a}])`;
    case Op.LOADGLOB: return `${push}(${s},${e}[${c}[${a}]])`;
    case Op.SETGLOB: return `${e}[${c}[${a}]]=${pop}(${s})`;
    case Op.LOADLOC: return `${push}(${s},${s}[${a}])`;
    case Op.SETLOC: return `${s}[${a}]=${pop}(${s})`;
    case Op.ADD: return R("+"); case Op.SUB: return R("-"); case Op.MUL: return R("*"); case Op.DIV: return R("/"); case Op.MOD: return R("%"); case Op.POW: return R("^");
    case Op.CONCAT: return C(".."); case Op.EQ: return C("=="); case Op.NEQ: return C("~="); case Op.LT: return C("<"); case Op.GT: return C(">"); case Op.LE: return C("<="); case Op.GE: return C(">=");
    case Op.NOT: return `local _a=${pop}(${s}) ${push}(${s},not _a)`;
    case Op.NEG: return `local _a=${pop}(${s}) ${push}(${s},-_a)`;
    case Op.LEN: return `local _a=${pop}(${s}) ${push}(${s},#_a)`;
    case Op.NEWTABLE: return `${push}(${s},{})`;
    case Op.SETTABLE: return `local _v=${pop}(${s}) local _k=${pop}(${s}) local _t=${pop}(${s}) _t[_k]=_v ${push}(${s},_t)`;
    case Op.GETTABLE: return `local _k=${pop}(${s}) local _t=${pop}(${s}) ${push}(${s},_t[_k])`;
    case Op.CALL: return `local _fn=${pop}(${s}) local _args={} for _i=1,${a} do _args[_i]=${pop}(${s}) end local _r={_fn(table.unpack(_args,1,${a}))} for _i=1,#_r do ${push}(${s},_r[_i]) end`;
    case Op.RET: return `${pc}=1/0`;
    case Op.JMP: return `${pc}=${+a-1}`;
    case Op.JMPF: return `if not ${pop}(${s}) then ${pc}=${+a-1} end`;
    case Op.JMPT: return `if ${pop}(${s}) then ${pc}=${+a-1} end`;
    case Op.NEWCLOSURE: return `${push}(${s},${p}[${a}])`;
    case Op.POP: return `${pop}(${s})`;
    case Op.DUP: return `${push}(${s},${s}[#${s}])`;
    default: return "";
  }
}

function genVMFunc(instrs: Instr[], constName: string, protoIdx: number, protoTableName: string): string {
  const fnName = randomName(12);
  const sN = randomName(4);
  const pcN = randomName(4);
  const eN = randomName(4);
  const iN = randomName(4);

  const instrStr = instrs.map(i => `{${i.op},${i.a??0},${i.b??0},${i.c??0}}`).join(",");

  const handlerLines: string[] = [];
  const ops = [Op.PUSHNIL,Op.PUSHBOOL,Op.PUSHNUM,Op.PUSHSTR,Op.LOADGLOB,Op.SETGLOB,Op.LOADLOC,Op.SETLOC,
    Op.ADD,Op.SUB,Op.MUL,Op.DIV,Op.MOD,Op.POW,Op.CONCAT,Op.EQ,Op.NEQ,Op.LT,Op.GT,Op.LE,Op.GE,
    Op.NOT,Op.NEG,Op.LEN,Op.NEWTABLE,Op.SETTABLE,Op.GETTABLE,Op.CALL,Op.RET,Op.JMP,Op.JMPF,Op.JMPT,Op.NEWCLOSURE,Op.POP,Op.DUP];
  for (const op of ops) {
    const h = opLua(op, sN, "a", constName, protoTableName, eN, pcN);
    if (h) handlerLines.push(`    elseif op==${op} then ${h}`);
  }

  const r1 = Math.floor(Math.random() * 999 + 1);
  const junk1 = `local ${randomName(4)}=${r1}`;
  const r2 = Math.floor(Math.random() * 999 + 1);
  const junk2 = `local ${randomName(4)}=${r2}`;

  return [
    `local function ${fnName}(${eN})`,
    `  local ${sN}={}`,
    `  local ${iN}={${instrStr}}`,
    `  local ${pcN}=1`,
    `  ${junk1}
  ${junk2}`,
    `  while ${pcN}<=#${iN} and ${pcN}>0 do`,
    `    local ins=${iN}[${pcN}]`,
    `    local op=ins[1] local a=ins[2] local b=ins[3] local c=ins[4]`,
    `    if false then`,
    handlerLines.join("\n"),
    `    end`,
    `    ${pcN}=${pcN}+1`,
    `  end`,
    `end`,
    `${protoTableName}[${protoIdx}]=${fnName}`,
  ].join("\n");
}

/* ========== MAIN EXPORT ========== */

export function vmEncode(code: string): string {
  try {
    const tokens = tokenize(code);
    const ast = new Parser(tokens).parse();
    if (ast.length === 0) return "--[[ empty input or parse error ]]";

    const compiler = new Compiler();
    compiler.compile(ast);

    const protos = compiler.proto.map(p => ({ instrs: p.instrs, consts: p.consts, name: p.name }));

    const constTables = protos.map(p => {
      const items = p.consts.map((c: any) => {
        if (typeof c === "string") { const key = randomName(6); return xorDecLua(xorEnc(c, key), key); }
        if (typeof c === "number") return numEncode(c);
        if (typeof c === "boolean") return c ? "true" : "false";
        return "nil";
      });
      return `{${items.join(",")}}`;
    });

    const pTbl = randomName(10);
    const eN = randomName(6);
    const parts: string[] = [
      `--[[ Dark Alliance Bytecode VM ]]`,
      `local ${eN}=_ENV or _G`,
      `local ${pTbl}={}`,
    ];

    for (let i = 0; i < protos.length; i++) {
      const cN = randomName(10);
      parts.push(`local ${cN}=${constTables[i]}`);
      parts.push(genVMFunc(protos[i].instrs, cN, i + 1, pTbl));
    }

    parts.push(`return ${pTbl}[1](${eN})`);
    return parts.join("\n");
  } catch (e: any) {
    return `--[[ VM Error: ${e.message || e} ]]`;
  }
}
