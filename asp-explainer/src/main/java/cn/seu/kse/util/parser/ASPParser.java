// Generated from ASP.g4 by ANTLR 4.8
package cn.seu.kse.util.parser;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class ASPParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		NAF_NOT=1, STRING=2, FULLSTOP=3, POSITIVE_INT=4, DECIMAL=5, ZERO=6, CONSTANT=7, 
		VAR=8, PLUS=9, MINUS=10, STAR=11, SLASH=12, LPAREN=13, RPAREN=14, LSBRACK=15, 
		RSBRACK=16, LCBRACK=17, RCBRACK=18, RANGE=19, COMMA=20, DISJUNCTION=21, 
		CONDITION=22, ASSIGN=23, WEAK_ASSIGN=24, SEMICOLON=25, LESS_THAN=26, LEQ=27, 
		GREATER_THAN=28, GEQ=29, EQUAL=30, DOUBLE_EQUAL=31, NEQ=32, AGGREGATE_OP=33, 
		META_OP=34, LINE_COMMENT=35, WS=36;
	public static final int
		RULE_negative_int = 0, RULE_integer = 1, RULE_natural_number = 2, RULE_arithmetic_op = 3, 
		RULE_relation_op = 4, RULE_simple_arithmetic_expr = 5, RULE_simple_arithmetic_expr2 = 6, 
		RULE_arithmethic_expr = 7, RULE_function = 8, RULE_term = 9, RULE_atom = 10, 
		RULE_range_atom = 11, RULE_literal = 12, RULE_default_literal = 13, RULE_extended_literal = 14, 
		RULE_term_tuple = 15, RULE_literal_tuple = 16, RULE_aggregate_elements = 17, 
		RULE_aggregate_elements_condition = 18, RULE_body_aggregate = 19, RULE_head_aggregate = 20, 
		RULE_relation_expr = 21, RULE_head = 22, RULE_body = 23, RULE_fact = 24, 
		RULE_constraint = 25, RULE_full_rule = 26, RULE_hard_rule = 27;
	private static String[] makeRuleNames() {
		return new String[] {
			"negative_int", "integer", "natural_number", "arithmetic_op", "relation_op", 
			"simple_arithmetic_expr", "simple_arithmetic_expr2", "arithmethic_expr", 
			"function", "term", "atom", "range_atom", "literal", "default_literal", 
			"extended_literal", "term_tuple", "literal_tuple", "aggregate_elements", 
			"aggregate_elements_condition", "body_aggregate", "head_aggregate", "relation_expr", 
			"head", "body", "fact", "constraint", "full_rule", "hard_rule"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'not '", null, "'.'", null, null, "'0'", null, null, "'+'", "'-'", 
			"'*'", "'/'", "'('", "')'", "'['", "']'", "'{'", "'}'", "'..'", "','", 
			"'|'", "':'", "':-'", "':~'", "';'", "'<'", "'<='", "'>'", "'>='", "'='", 
			"'=='", "'!='", null, "'#show '"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "NAF_NOT", "STRING", "FULLSTOP", "POSITIVE_INT", "DECIMAL", "ZERO", 
			"CONSTANT", "VAR", "PLUS", "MINUS", "STAR", "SLASH", "LPAREN", "RPAREN", 
			"LSBRACK", "RSBRACK", "LCBRACK", "RCBRACK", "RANGE", "COMMA", "DISJUNCTION", 
			"CONDITION", "ASSIGN", "WEAK_ASSIGN", "SEMICOLON", "LESS_THAN", "LEQ", 
			"GREATER_THAN", "GEQ", "EQUAL", "DOUBLE_EQUAL", "NEQ", "AGGREGATE_OP", 
			"META_OP", "LINE_COMMENT", "WS"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "ASP.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public ASPParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class Negative_intContext extends ParserRuleContext {
		public TerminalNode MINUS() { return getToken(ASPParser.MINUS, 0); }
		public TerminalNode POSITIVE_INT() { return getToken(ASPParser.POSITIVE_INT, 0); }
		public Negative_intContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_negative_int; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterNegative_int(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitNegative_int(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitNegative_int(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Negative_intContext negative_int() throws RecognitionException {
		Negative_intContext _localctx = new Negative_intContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_negative_int);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(56);
			match(MINUS);
			setState(57);
			match(POSITIVE_INT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntegerContext extends ParserRuleContext {
		public TerminalNode POSITIVE_INT() { return getToken(ASPParser.POSITIVE_INT, 0); }
		public Negative_intContext negative_int() {
			return getRuleContext(Negative_intContext.class,0);
		}
		public TerminalNode ZERO() { return getToken(ASPParser.ZERO, 0); }
		public IntegerContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_integer; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterInteger(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitInteger(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitInteger(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IntegerContext integer() throws RecognitionException {
		IntegerContext _localctx = new IntegerContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_integer);
		try {
			setState(62);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POSITIVE_INT:
				enterOuterAlt(_localctx, 1);
				{
				setState(59);
				match(POSITIVE_INT);
				}
				break;
			case MINUS:
				enterOuterAlt(_localctx, 2);
				{
				setState(60);
				negative_int();
				}
				break;
			case ZERO:
				enterOuterAlt(_localctx, 3);
				{
				setState(61);
				match(ZERO);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Natural_numberContext extends ParserRuleContext {
		public TerminalNode POSITIVE_INT() { return getToken(ASPParser.POSITIVE_INT, 0); }
		public TerminalNode ZERO() { return getToken(ASPParser.ZERO, 0); }
		public Natural_numberContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_natural_number; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterNatural_number(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitNatural_number(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitNatural_number(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Natural_numberContext natural_number() throws RecognitionException {
		Natural_numberContext _localctx = new Natural_numberContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_natural_number);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(64);
			_la = _input.LA(1);
			if ( !(_la==POSITIVE_INT || _la==ZERO) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Arithmetic_opContext extends ParserRuleContext {
		public TerminalNode PLUS() { return getToken(ASPParser.PLUS, 0); }
		public TerminalNode MINUS() { return getToken(ASPParser.MINUS, 0); }
		public TerminalNode STAR() { return getToken(ASPParser.STAR, 0); }
		public TerminalNode SLASH() { return getToken(ASPParser.SLASH, 0); }
		public Arithmetic_opContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arithmetic_op; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterArithmetic_op(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitArithmetic_op(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitArithmetic_op(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Arithmetic_opContext arithmetic_op() throws RecognitionException {
		Arithmetic_opContext _localctx = new Arithmetic_opContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_arithmetic_op);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(66);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << PLUS) | (1L << MINUS) | (1L << STAR) | (1L << SLASH))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Relation_opContext extends ParserRuleContext {
		public TerminalNode LESS_THAN() { return getToken(ASPParser.LESS_THAN, 0); }
		public TerminalNode LEQ() { return getToken(ASPParser.LEQ, 0); }
		public TerminalNode GREATER_THAN() { return getToken(ASPParser.GREATER_THAN, 0); }
		public TerminalNode GEQ() { return getToken(ASPParser.GEQ, 0); }
		public TerminalNode EQUAL() { return getToken(ASPParser.EQUAL, 0); }
		public TerminalNode DOUBLE_EQUAL() { return getToken(ASPParser.DOUBLE_EQUAL, 0); }
		public TerminalNode NEQ() { return getToken(ASPParser.NEQ, 0); }
		public Relation_opContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_relation_op; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterRelation_op(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitRelation_op(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitRelation_op(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Relation_opContext relation_op() throws RecognitionException {
		Relation_opContext _localctx = new Relation_opContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_relation_op);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(68);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Simple_arithmetic_exprContext extends ParserRuleContext {
		public IntegerContext integer() {
			return getRuleContext(IntegerContext.class,0);
		}
		public List<TerminalNode> VAR() { return getTokens(ASPParser.VAR); }
		public TerminalNode VAR(int i) {
			return getToken(ASPParser.VAR, i);
		}
		public TerminalNode MINUS() { return getToken(ASPParser.MINUS, 0); }
		public List<Arithmetic_opContext> arithmetic_op() {
			return getRuleContexts(Arithmetic_opContext.class);
		}
		public Arithmetic_opContext arithmetic_op(int i) {
			return getRuleContext(Arithmetic_opContext.class,i);
		}
		public List<Natural_numberContext> natural_number() {
			return getRuleContexts(Natural_numberContext.class);
		}
		public Natural_numberContext natural_number(int i) {
			return getRuleContext(Natural_numberContext.class,i);
		}
		public Simple_arithmetic_exprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_simple_arithmetic_expr; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterSimple_arithmetic_expr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitSimple_arithmetic_expr(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitSimple_arithmetic_expr(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Simple_arithmetic_exprContext simple_arithmetic_expr() throws RecognitionException {
		Simple_arithmetic_exprContext _localctx = new Simple_arithmetic_exprContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_simple_arithmetic_expr);
		int _la;
		try {
			int _alt;
			setState(92);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(70);
				integer();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(72);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==MINUS) {
					{
					setState(71);
					match(MINUS);
					}
				}

				setState(74);
				match(VAR);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(80);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
				case 1:
					{
					setState(75);
					integer();
					}
					break;
				case 2:
					{
					setState(77);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==MINUS) {
						{
						setState(76);
						match(MINUS);
						}
					}

					setState(79);
					match(VAR);
					}
					break;
				}
				setState(89);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,5,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(82);
						arithmetic_op();
						setState(85);
						_errHandler.sync(this);
						switch (_input.LA(1)) {
						case POSITIVE_INT:
						case ZERO:
							{
							setState(83);
							natural_number();
							}
							break;
						case VAR:
							{
							setState(84);
							match(VAR);
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						}
						} 
					}
					setState(91);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,5,_ctx);
				}
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Simple_arithmetic_expr2Context extends ParserRuleContext {
		public Simple_arithmetic_exprContext simple_arithmetic_expr() {
			return getRuleContext(Simple_arithmetic_exprContext.class,0);
		}
		public TerminalNode LPAREN() { return getToken(ASPParser.LPAREN, 0); }
		public List<Simple_arithmetic_expr2Context> simple_arithmetic_expr2() {
			return getRuleContexts(Simple_arithmetic_expr2Context.class);
		}
		public Simple_arithmetic_expr2Context simple_arithmetic_expr2(int i) {
			return getRuleContext(Simple_arithmetic_expr2Context.class,i);
		}
		public TerminalNode RPAREN() { return getToken(ASPParser.RPAREN, 0); }
		public Arithmetic_opContext arithmetic_op() {
			return getRuleContext(Arithmetic_opContext.class,0);
		}
		public Simple_arithmetic_expr2Context(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_simple_arithmetic_expr2; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterSimple_arithmetic_expr2(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitSimple_arithmetic_expr2(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitSimple_arithmetic_expr2(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Simple_arithmetic_expr2Context simple_arithmetic_expr2() throws RecognitionException {
		return simple_arithmetic_expr2(0);
	}

	private Simple_arithmetic_expr2Context simple_arithmetic_expr2(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		Simple_arithmetic_expr2Context _localctx = new Simple_arithmetic_expr2Context(_ctx, _parentState);
		Simple_arithmetic_expr2Context _prevctx = _localctx;
		int _startState = 12;
		enterRecursionRule(_localctx, 12, RULE_simple_arithmetic_expr2, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(100);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POSITIVE_INT:
			case ZERO:
			case VAR:
			case MINUS:
				{
				setState(95);
				simple_arithmetic_expr();
				}
				break;
			case LPAREN:
				{
				{
				setState(96);
				match(LPAREN);
				setState(97);
				simple_arithmetic_expr2(0);
				setState(98);
				match(RPAREN);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			_ctx.stop = _input.LT(-1);
			setState(108);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					{
					_localctx = new Simple_arithmetic_expr2Context(_parentctx, _parentState);
					pushNewRecursionContext(_localctx, _startState, RULE_simple_arithmetic_expr2);
					setState(102);
					if (!(precpred(_ctx, 1))) throw new FailedPredicateException(this, "precpred(_ctx, 1)");
					setState(103);
					arithmetic_op();
					setState(104);
					simple_arithmetic_expr2(2);
					}
					} 
				}
				setState(110);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public static class Arithmethic_exprContext extends ParserRuleContext {
		public Simple_arithmetic_expr2Context simple_arithmetic_expr2() {
			return getRuleContext(Simple_arithmetic_expr2Context.class,0);
		}
		public TerminalNode MINUS() { return getToken(ASPParser.MINUS, 0); }
		public TerminalNode LPAREN() { return getToken(ASPParser.LPAREN, 0); }
		public TerminalNode RPAREN() { return getToken(ASPParser.RPAREN, 0); }
		public Arithmethic_exprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arithmethic_expr; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterArithmethic_expr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitArithmethic_expr(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitArithmethic_expr(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Arithmethic_exprContext arithmethic_expr() throws RecognitionException {
		Arithmethic_exprContext _localctx = new Arithmethic_exprContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_arithmethic_expr);
		try {
			setState(117);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(111);
				simple_arithmetic_expr2(0);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(112);
				match(MINUS);
				setState(113);
				match(LPAREN);
				setState(114);
				simple_arithmetic_expr2(0);
				setState(115);
				match(RPAREN);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FunctionContext extends ParserRuleContext {
		public TerminalNode CONSTANT() { return getToken(ASPParser.CONSTANT, 0); }
		public TerminalNode LPAREN() { return getToken(ASPParser.LPAREN, 0); }
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public TerminalNode RPAREN() { return getToken(ASPParser.RPAREN, 0); }
		public List<TerminalNode> COMMA() { return getTokens(ASPParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(ASPParser.COMMA, i);
		}
		public FunctionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_function; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterFunction(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitFunction(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitFunction(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FunctionContext function() throws RecognitionException {
		FunctionContext _localctx = new FunctionContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_function);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(119);
			match(CONSTANT);
			setState(120);
			match(LPAREN);
			setState(121);
			term();
			setState(126);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(122);
				match(COMMA);
				setState(123);
				term();
				}
				}
				setState(128);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(129);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TermContext extends ParserRuleContext {
		public TerminalNode VAR() { return getToken(ASPParser.VAR, 0); }
		public TerminalNode CONSTANT() { return getToken(ASPParser.CONSTANT, 0); }
		public IntegerContext integer() {
			return getRuleContext(IntegerContext.class,0);
		}
		public Arithmethic_exprContext arithmethic_expr() {
			return getRuleContext(Arithmethic_exprContext.class,0);
		}
		public FunctionContext function() {
			return getRuleContext(FunctionContext.class,0);
		}
		public TerminalNode STRING() { return getToken(ASPParser.STRING, 0); }
		public TermContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_term; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterTerm(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitTerm(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitTerm(this);
			else return visitor.visitChildren(this);
		}
	}

	public final TermContext term() throws RecognitionException {
		TermContext _localctx = new TermContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_term);
		try {
			setState(137);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(131);
				match(VAR);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(132);
				match(CONSTANT);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(133);
				integer();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(134);
				arithmethic_expr();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(135);
				function();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(136);
				match(STRING);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AtomContext extends ParserRuleContext {
		public TerminalNode CONSTANT() { return getToken(ASPParser.CONSTANT, 0); }
		public TerminalNode LPAREN() { return getToken(ASPParser.LPAREN, 0); }
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public TerminalNode RPAREN() { return getToken(ASPParser.RPAREN, 0); }
		public List<TerminalNode> COMMA() { return getTokens(ASPParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(ASPParser.COMMA, i);
		}
		public AtomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_atom; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterAtom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitAtom(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitAtom(this);
			else return visitor.visitChildren(this);
		}
	}

	public final AtomContext atom() throws RecognitionException {
		AtomContext _localctx = new AtomContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_atom);
		int _la;
		try {
			setState(152);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(139);
				match(CONSTANT);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(140);
				match(CONSTANT);
				setState(141);
				match(LPAREN);
				setState(142);
				term();
				setState(147);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==COMMA) {
					{
					{
					setState(143);
					match(COMMA);
					setState(144);
					term();
					}
					}
					setState(149);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				setState(150);
				match(RPAREN);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Range_atomContext extends ParserRuleContext {
		public TerminalNode CONSTANT() { return getToken(ASPParser.CONSTANT, 0); }
		public TerminalNode LPAREN() { return getToken(ASPParser.LPAREN, 0); }
		public List<IntegerContext> integer() {
			return getRuleContexts(IntegerContext.class);
		}
		public IntegerContext integer(int i) {
			return getRuleContext(IntegerContext.class,i);
		}
		public TerminalNode RANGE() { return getToken(ASPParser.RANGE, 0); }
		public TerminalNode RPAREN() { return getToken(ASPParser.RPAREN, 0); }
		public Range_atomContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_range_atom; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterRange_atom(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitRange_atom(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitRange_atom(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Range_atomContext range_atom() throws RecognitionException {
		Range_atomContext _localctx = new Range_atomContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_range_atom);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(154);
			match(CONSTANT);
			setState(155);
			match(LPAREN);
			setState(156);
			integer();
			setState(157);
			match(RANGE);
			setState(158);
			integer();
			setState(159);
			match(RPAREN);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LiteralContext extends ParserRuleContext {
		public AtomContext atom() {
			return getRuleContext(AtomContext.class,0);
		}
		public TerminalNode MINUS() { return getToken(ASPParser.MINUS, 0); }
		public LiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_literal; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterLiteral(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitLiteral(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitLiteral(this);
			else return visitor.visitChildren(this);
		}
	}

	public final LiteralContext literal() throws RecognitionException {
		LiteralContext _localctx = new LiteralContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_literal);
		try {
			setState(164);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case CONSTANT:
				enterOuterAlt(_localctx, 1);
				{
				setState(161);
				atom();
				}
				break;
			case MINUS:
				enterOuterAlt(_localctx, 2);
				{
				setState(162);
				match(MINUS);
				setState(163);
				atom();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Default_literalContext extends ParserRuleContext {
		public TerminalNode NAF_NOT() { return getToken(ASPParser.NAF_NOT, 0); }
		public LiteralContext literal() {
			return getRuleContext(LiteralContext.class,0);
		}
		public Default_literalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_default_literal; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterDefault_literal(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitDefault_literal(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitDefault_literal(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Default_literalContext default_literal() throws RecognitionException {
		Default_literalContext _localctx = new Default_literalContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_default_literal);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(166);
			match(NAF_NOT);
			setState(167);
			literal();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Extended_literalContext extends ParserRuleContext {
		public LiteralContext literal() {
			return getRuleContext(LiteralContext.class,0);
		}
		public Default_literalContext default_literal() {
			return getRuleContext(Default_literalContext.class,0);
		}
		public Extended_literalContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_extended_literal; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterExtended_literal(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitExtended_literal(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitExtended_literal(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Extended_literalContext extended_literal() throws RecognitionException {
		Extended_literalContext _localctx = new Extended_literalContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_extended_literal);
		try {
			setState(171);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case CONSTANT:
			case MINUS:
				enterOuterAlt(_localctx, 1);
				{
				setState(169);
				literal();
				}
				break;
			case NAF_NOT:
				enterOuterAlt(_localctx, 2);
				{
				setState(170);
				default_literal();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Term_tupleContext extends ParserRuleContext {
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(ASPParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(ASPParser.COMMA, i);
		}
		public Term_tupleContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_term_tuple; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterTerm_tuple(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitTerm_tuple(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitTerm_tuple(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Term_tupleContext term_tuple() throws RecognitionException {
		Term_tupleContext _localctx = new Term_tupleContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_term_tuple);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(173);
			term();
			setState(178);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(174);
				match(COMMA);
				setState(175);
				term();
				}
				}
				setState(180);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Literal_tupleContext extends ParserRuleContext {
		public List<LiteralContext> literal() {
			return getRuleContexts(LiteralContext.class);
		}
		public LiteralContext literal(int i) {
			return getRuleContext(LiteralContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(ASPParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(ASPParser.COMMA, i);
		}
		public Literal_tupleContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_literal_tuple; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterLiteral_tuple(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitLiteral_tuple(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitLiteral_tuple(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Literal_tupleContext literal_tuple() throws RecognitionException {
		Literal_tupleContext _localctx = new Literal_tupleContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_literal_tuple);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(181);
			literal();
			setState(186);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(182);
				match(COMMA);
				setState(183);
				literal();
				}
				}
				setState(188);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Aggregate_elementsContext extends ParserRuleContext {
		public List<Literal_tupleContext> literal_tuple() {
			return getRuleContexts(Literal_tupleContext.class);
		}
		public Literal_tupleContext literal_tuple(int i) {
			return getRuleContext(Literal_tupleContext.class,i);
		}
		public List<Term_tupleContext> term_tuple() {
			return getRuleContexts(Term_tupleContext.class);
		}
		public Term_tupleContext term_tuple(int i) {
			return getRuleContext(Term_tupleContext.class,i);
		}
		public List<TerminalNode> CONDITION() { return getTokens(ASPParser.CONDITION); }
		public TerminalNode CONDITION(int i) {
			return getToken(ASPParser.CONDITION, i);
		}
		public List<TerminalNode> SEMICOLON() { return getTokens(ASPParser.SEMICOLON); }
		public TerminalNode SEMICOLON(int i) {
			return getToken(ASPParser.SEMICOLON, i);
		}
		public Aggregate_elementsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_aggregate_elements; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterAggregate_elements(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitAggregate_elements(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitAggregate_elements(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Aggregate_elementsContext aggregate_elements() throws RecognitionException {
		Aggregate_elementsContext _localctx = new Aggregate_elementsContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_aggregate_elements);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(192);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,18,_ctx) ) {
			case 1:
				{
				setState(189);
				term_tuple();
				setState(190);
				match(CONDITION);
				}
				break;
			}
			setState(194);
			literal_tuple();
			setState(204);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==SEMICOLON) {
				{
				{
				setState(195);
				match(SEMICOLON);
				setState(199);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,19,_ctx) ) {
				case 1:
					{
					setState(196);
					term_tuple();
					setState(197);
					match(CONDITION);
					}
					break;
				}
				setState(201);
				literal_tuple();
				}
				}
				setState(206);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Aggregate_elements_conditionContext extends ParserRuleContext {
		public List<Literal_tupleContext> literal_tuple() {
			return getRuleContexts(Literal_tupleContext.class);
		}
		public Literal_tupleContext literal_tuple(int i) {
			return getRuleContext(Literal_tupleContext.class,i);
		}
		public List<TerminalNode> CONDITION() { return getTokens(ASPParser.CONDITION); }
		public TerminalNode CONDITION(int i) {
			return getToken(ASPParser.CONDITION, i);
		}
		public List<Term_tupleContext> term_tuple() {
			return getRuleContexts(Term_tupleContext.class);
		}
		public Term_tupleContext term_tuple(int i) {
			return getRuleContext(Term_tupleContext.class,i);
		}
		public List<TerminalNode> SEMICOLON() { return getTokens(ASPParser.SEMICOLON); }
		public TerminalNode SEMICOLON(int i) {
			return getToken(ASPParser.SEMICOLON, i);
		}
		public Aggregate_elements_conditionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_aggregate_elements_condition; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterAggregate_elements_condition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitAggregate_elements_condition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitAggregate_elements_condition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Aggregate_elements_conditionContext aggregate_elements_condition() throws RecognitionException {
		Aggregate_elements_conditionContext _localctx = new Aggregate_elements_conditionContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_aggregate_elements_condition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(210);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,21,_ctx) ) {
			case 1:
				{
				setState(207);
				term_tuple();
				setState(208);
				match(CONDITION);
				}
				break;
			}
			setState(212);
			literal_tuple();
			setState(213);
			match(CONDITION);
			setState(214);
			literal_tuple();
			setState(227);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==SEMICOLON) {
				{
				{
				setState(215);
				match(SEMICOLON);
				setState(219);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,22,_ctx) ) {
				case 1:
					{
					setState(216);
					term_tuple();
					setState(217);
					match(CONDITION);
					}
					break;
				}
				setState(221);
				literal_tuple();
				setState(222);
				match(CONDITION);
				setState(223);
				literal_tuple();
				}
				}
				setState(229);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Body_aggregateContext extends ParserRuleContext {
		public TerminalNode LCBRACK() { return getToken(ASPParser.LCBRACK, 0); }
		public Aggregate_elementsContext aggregate_elements() {
			return getRuleContext(Aggregate_elementsContext.class,0);
		}
		public TerminalNode RCBRACK() { return getToken(ASPParser.RCBRACK, 0); }
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public TerminalNode AGGREGATE_OP() { return getToken(ASPParser.AGGREGATE_OP, 0); }
		public List<Relation_opContext> relation_op() {
			return getRuleContexts(Relation_opContext.class);
		}
		public Relation_opContext relation_op(int i) {
			return getRuleContext(Relation_opContext.class,i);
		}
		public Body_aggregateContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_body_aggregate; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterBody_aggregate(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitBody_aggregate(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitBody_aggregate(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Body_aggregateContext body_aggregate() throws RecognitionException {
		Body_aggregateContext _localctx = new Body_aggregateContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_body_aggregate);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(234);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << STRING) | (1L << POSITIVE_INT) | (1L << ZERO) | (1L << CONSTANT) | (1L << VAR) | (1L << MINUS) | (1L << LPAREN))) != 0)) {
				{
				setState(230);
				term();
				setState(232);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) {
					{
					setState(231);
					relation_op();
					}
				}

				}
			}

			setState(237);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==AGGREGATE_OP) {
				{
				setState(236);
				match(AGGREGATE_OP);
				}
			}

			setState(239);
			match(LCBRACK);
			setState(240);
			aggregate_elements();
			setState(241);
			match(RCBRACK);
			setState(246);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << STRING) | (1L << POSITIVE_INT) | (1L << ZERO) | (1L << CONSTANT) | (1L << VAR) | (1L << MINUS) | (1L << LPAREN) | (1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) {
				{
				setState(243);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) {
					{
					setState(242);
					relation_op();
					}
				}

				setState(245);
				term();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Head_aggregateContext extends ParserRuleContext {
		public TerminalNode LCBRACK() { return getToken(ASPParser.LCBRACK, 0); }
		public Aggregate_elements_conditionContext aggregate_elements_condition() {
			return getRuleContext(Aggregate_elements_conditionContext.class,0);
		}
		public TerminalNode RCBRACK() { return getToken(ASPParser.RCBRACK, 0); }
		public List<TermContext> term() {
			return getRuleContexts(TermContext.class);
		}
		public TermContext term(int i) {
			return getRuleContext(TermContext.class,i);
		}
		public TerminalNode AGGREGATE_OP() { return getToken(ASPParser.AGGREGATE_OP, 0); }
		public List<Relation_opContext> relation_op() {
			return getRuleContexts(Relation_opContext.class);
		}
		public Relation_opContext relation_op(int i) {
			return getRuleContext(Relation_opContext.class,i);
		}
		public Head_aggregateContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_head_aggregate; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterHead_aggregate(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitHead_aggregate(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitHead_aggregate(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Head_aggregateContext head_aggregate() throws RecognitionException {
		Head_aggregateContext _localctx = new Head_aggregateContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_head_aggregate);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(252);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << STRING) | (1L << POSITIVE_INT) | (1L << ZERO) | (1L << CONSTANT) | (1L << VAR) | (1L << MINUS) | (1L << LPAREN))) != 0)) {
				{
				setState(248);
				term();
				setState(250);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) {
					{
					setState(249);
					relation_op();
					}
				}

				}
			}

			setState(255);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==AGGREGATE_OP) {
				{
				setState(254);
				match(AGGREGATE_OP);
				}
			}

			setState(257);
			match(LCBRACK);
			setState(258);
			aggregate_elements_condition();
			setState(259);
			match(RCBRACK);
			setState(264);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << STRING) | (1L << POSITIVE_INT) | (1L << ZERO) | (1L << CONSTANT) | (1L << VAR) | (1L << MINUS) | (1L << LPAREN) | (1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) {
				{
				setState(261);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LESS_THAN) | (1L << LEQ) | (1L << GREATER_THAN) | (1L << GEQ) | (1L << EQUAL) | (1L << DOUBLE_EQUAL) | (1L << NEQ))) != 0)) {
					{
					setState(260);
					relation_op();
					}
				}

				setState(263);
				term();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Relation_exprContext extends ParserRuleContext {
		public List<TerminalNode> VAR() { return getTokens(ASPParser.VAR); }
		public TerminalNode VAR(int i) {
			return getToken(ASPParser.VAR, i);
		}
		public Relation_opContext relation_op() {
			return getRuleContext(Relation_opContext.class,0);
		}
		public List<TerminalNode> MINUS() { return getTokens(ASPParser.MINUS); }
		public TerminalNode MINUS(int i) {
			return getToken(ASPParser.MINUS, i);
		}
		public TerminalNode STRING() { return getToken(ASPParser.STRING, 0); }
		public List<Arithmethic_exprContext> arithmethic_expr() {
			return getRuleContexts(Arithmethic_exprContext.class);
		}
		public Arithmethic_exprContext arithmethic_expr(int i) {
			return getRuleContext(Arithmethic_exprContext.class,i);
		}
		public Relation_exprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_relation_expr; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterRelation_expr(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitRelation_expr(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitRelation_expr(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Relation_exprContext relation_expr() throws RecognitionException {
		Relation_exprContext _localctx = new Relation_exprContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_relation_expr);
		int _la;
		try {
			setState(295);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,40,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(267);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==MINUS) {
					{
					setState(266);
					match(MINUS);
					}
				}

				setState(269);
				match(VAR);
				setState(270);
				relation_op();
				setState(272);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==MINUS) {
					{
					setState(271);
					match(MINUS);
					}
				}

				setState(274);
				match(VAR);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(276);
				match(VAR);
				setState(277);
				relation_op();
				setState(278);
				match(STRING);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(285);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,37,_ctx) ) {
				case 1:
					{
					setState(281);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==MINUS) {
						{
						setState(280);
						match(MINUS);
						}
					}

					setState(283);
					match(VAR);
					}
					break;
				case 2:
					{
					setState(284);
					arithmethic_expr();
					}
					break;
				}
				setState(287);
				relation_op();
				setState(293);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,39,_ctx) ) {
				case 1:
					{
					setState(289);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==MINUS) {
						{
						setState(288);
						match(MINUS);
						}
					}

					setState(291);
					match(VAR);
					}
					break;
				case 2:
					{
					setState(292);
					arithmethic_expr();
					}
					break;
				}
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class HeadContext extends ParserRuleContext {
		public List<LiteralContext> literal() {
			return getRuleContexts(LiteralContext.class);
		}
		public LiteralContext literal(int i) {
			return getRuleContext(LiteralContext.class,i);
		}
		public List<TerminalNode> DISJUNCTION() { return getTokens(ASPParser.DISJUNCTION); }
		public TerminalNode DISJUNCTION(int i) {
			return getToken(ASPParser.DISJUNCTION, i);
		}
		public Head_aggregateContext head_aggregate() {
			return getRuleContext(Head_aggregateContext.class,0);
		}
		public HeadContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_head; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterHead(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitHead(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitHead(this);
			else return visitor.visitChildren(this);
		}
	}

	public final HeadContext head() throws RecognitionException {
		HeadContext _localctx = new HeadContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_head);
		int _la;
		try {
			setState(306);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,42,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(297);
				literal();
				setState(302);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==DISJUNCTION) {
					{
					{
					setState(298);
					match(DISJUNCTION);
					setState(299);
					literal();
					}
					}
					setState(304);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(305);
				head_aggregate();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BodyContext extends ParserRuleContext {
		public List<Extended_literalContext> extended_literal() {
			return getRuleContexts(Extended_literalContext.class);
		}
		public Extended_literalContext extended_literal(int i) {
			return getRuleContext(Extended_literalContext.class,i);
		}
		public List<Relation_exprContext> relation_expr() {
			return getRuleContexts(Relation_exprContext.class);
		}
		public Relation_exprContext relation_expr(int i) {
			return getRuleContext(Relation_exprContext.class,i);
		}
		public List<Body_aggregateContext> body_aggregate() {
			return getRuleContexts(Body_aggregateContext.class);
		}
		public Body_aggregateContext body_aggregate(int i) {
			return getRuleContext(Body_aggregateContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(ASPParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(ASPParser.COMMA, i);
		}
		public BodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_body; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterBody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitBody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitBody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final BodyContext body() throws RecognitionException {
		BodyContext _localctx = new BodyContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_body);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(311);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,43,_ctx) ) {
			case 1:
				{
				setState(308);
				extended_literal();
				}
				break;
			case 2:
				{
				setState(309);
				relation_expr();
				}
				break;
			case 3:
				{
				setState(310);
				body_aggregate();
				}
				break;
			}
			setState(321);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(313);
				match(COMMA);
				setState(317);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,44,_ctx) ) {
				case 1:
					{
					setState(314);
					extended_literal();
					}
					break;
				case 2:
					{
					setState(315);
					relation_expr();
					}
					break;
				case 3:
					{
					setState(316);
					body_aggregate();
					}
					break;
				}
				}
				}
				setState(323);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FactContext extends ParserRuleContext {
		public TerminalNode FULLSTOP() { return getToken(ASPParser.FULLSTOP, 0); }
		public HeadContext head() {
			return getRuleContext(HeadContext.class,0);
		}
		public Range_atomContext range_atom() {
			return getRuleContext(Range_atomContext.class,0);
		}
		public FactContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_fact; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterFact(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitFact(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitFact(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FactContext fact() throws RecognitionException {
		FactContext _localctx = new FactContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_fact);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(326);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,46,_ctx) ) {
			case 1:
				{
				setState(324);
				head();
				}
				break;
			case 2:
				{
				setState(325);
				range_atom();
				}
				break;
			}
			setState(328);
			match(FULLSTOP);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ConstraintContext extends ParserRuleContext {
		public TerminalNode ASSIGN() { return getToken(ASPParser.ASSIGN, 0); }
		public BodyContext body() {
			return getRuleContext(BodyContext.class,0);
		}
		public TerminalNode FULLSTOP() { return getToken(ASPParser.FULLSTOP, 0); }
		public ConstraintContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_constraint; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterConstraint(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitConstraint(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitConstraint(this);
			else return visitor.visitChildren(this);
		}
	}

	public final ConstraintContext constraint() throws RecognitionException {
		ConstraintContext _localctx = new ConstraintContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_constraint);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(330);
			match(ASSIGN);
			setState(331);
			body();
			setState(332);
			match(FULLSTOP);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Full_ruleContext extends ParserRuleContext {
		public HeadContext head() {
			return getRuleContext(HeadContext.class,0);
		}
		public TerminalNode ASSIGN() { return getToken(ASPParser.ASSIGN, 0); }
		public BodyContext body() {
			return getRuleContext(BodyContext.class,0);
		}
		public TerminalNode FULLSTOP() { return getToken(ASPParser.FULLSTOP, 0); }
		public Full_ruleContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_full_rule; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterFull_rule(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitFull_rule(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitFull_rule(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Full_ruleContext full_rule() throws RecognitionException {
		Full_ruleContext _localctx = new Full_ruleContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_full_rule);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(334);
			head();
			setState(335);
			match(ASSIGN);
			setState(336);
			body();
			setState(337);
			match(FULLSTOP);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Hard_ruleContext extends ParserRuleContext {
		public FactContext fact() {
			return getRuleContext(FactContext.class,0);
		}
		public ConstraintContext constraint() {
			return getRuleContext(ConstraintContext.class,0);
		}
		public Full_ruleContext full_rule() {
			return getRuleContext(Full_ruleContext.class,0);
		}
		public Hard_ruleContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_hard_rule; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).enterHard_rule(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof ASPListener ) ((ASPListener)listener).exitHard_rule(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof ASPVisitor ) return ((ASPVisitor<? extends T>)visitor).visitHard_rule(this);
			else return visitor.visitChildren(this);
		}
	}

	public final Hard_ruleContext hard_rule() throws RecognitionException {
		Hard_ruleContext _localctx = new Hard_ruleContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_hard_rule);
		try {
			setState(342);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,47,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(339);
				fact();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(340);
				constraint();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(341);
				full_rule();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 6:
			return simple_arithmetic_expr2_sempred((Simple_arithmetic_expr2Context)_localctx, predIndex);
		}
		return true;
	}
	private boolean simple_arithmetic_expr2_sempred(Simple_arithmetic_expr2Context _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 1);
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3&\u015b\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\3\2\3\2\3\2\3\3\3\3\3\3\5\3A"+
		"\n\3\3\4\3\4\3\5\3\5\3\6\3\6\3\7\3\7\5\7K\n\7\3\7\3\7\3\7\5\7P\n\7\3\7"+
		"\5\7S\n\7\3\7\3\7\3\7\5\7X\n\7\7\7Z\n\7\f\7\16\7]\13\7\5\7_\n\7\3\b\3"+
		"\b\3\b\3\b\3\b\3\b\5\bg\n\b\3\b\3\b\3\b\3\b\7\bm\n\b\f\b\16\bp\13\b\3"+
		"\t\3\t\3\t\3\t\3\t\3\t\5\tx\n\t\3\n\3\n\3\n\3\n\3\n\7\n\177\n\n\f\n\16"+
		"\n\u0082\13\n\3\n\3\n\3\13\3\13\3\13\3\13\3\13\3\13\5\13\u008c\n\13\3"+
		"\f\3\f\3\f\3\f\3\f\3\f\7\f\u0094\n\f\f\f\16\f\u0097\13\f\3\f\3\f\5\f\u009b"+
		"\n\f\3\r\3\r\3\r\3\r\3\r\3\r\3\r\3\16\3\16\3\16\5\16\u00a7\n\16\3\17\3"+
		"\17\3\17\3\20\3\20\5\20\u00ae\n\20\3\21\3\21\3\21\7\21\u00b3\n\21\f\21"+
		"\16\21\u00b6\13\21\3\22\3\22\3\22\7\22\u00bb\n\22\f\22\16\22\u00be\13"+
		"\22\3\23\3\23\3\23\5\23\u00c3\n\23\3\23\3\23\3\23\3\23\3\23\5\23\u00ca"+
		"\n\23\3\23\7\23\u00cd\n\23\f\23\16\23\u00d0\13\23\3\24\3\24\3\24\5\24"+
		"\u00d5\n\24\3\24\3\24\3\24\3\24\3\24\3\24\3\24\5\24\u00de\n\24\3\24\3"+
		"\24\3\24\3\24\7\24\u00e4\n\24\f\24\16\24\u00e7\13\24\3\25\3\25\5\25\u00eb"+
		"\n\25\5\25\u00ed\n\25\3\25\5\25\u00f0\n\25\3\25\3\25\3\25\3\25\5\25\u00f6"+
		"\n\25\3\25\5\25\u00f9\n\25\3\26\3\26\5\26\u00fd\n\26\5\26\u00ff\n\26\3"+
		"\26\5\26\u0102\n\26\3\26\3\26\3\26\3\26\5\26\u0108\n\26\3\26\5\26\u010b"+
		"\n\26\3\27\5\27\u010e\n\27\3\27\3\27\3\27\5\27\u0113\n\27\3\27\3\27\3"+
		"\27\3\27\3\27\3\27\3\27\5\27\u011c\n\27\3\27\3\27\5\27\u0120\n\27\3\27"+
		"\3\27\5\27\u0124\n\27\3\27\3\27\5\27\u0128\n\27\5\27\u012a\n\27\3\30\3"+
		"\30\3\30\7\30\u012f\n\30\f\30\16\30\u0132\13\30\3\30\5\30\u0135\n\30\3"+
		"\31\3\31\3\31\5\31\u013a\n\31\3\31\3\31\3\31\3\31\5\31\u0140\n\31\7\31"+
		"\u0142\n\31\f\31\16\31\u0145\13\31\3\32\3\32\5\32\u0149\n\32\3\32\3\32"+
		"\3\33\3\33\3\33\3\33\3\34\3\34\3\34\3\34\3\34\3\35\3\35\3\35\5\35\u0159"+
		"\n\35\3\35\2\3\16\36\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$&(*,.\60"+
		"\62\64\668\2\5\4\2\6\6\b\b\3\2\13\16\3\2\34\"\2\u0178\2:\3\2\2\2\4@\3"+
		"\2\2\2\6B\3\2\2\2\bD\3\2\2\2\nF\3\2\2\2\f^\3\2\2\2\16f\3\2\2\2\20w\3\2"+
		"\2\2\22y\3\2\2\2\24\u008b\3\2\2\2\26\u009a\3\2\2\2\30\u009c\3\2\2\2\32"+
		"\u00a6\3\2\2\2\34\u00a8\3\2\2\2\36\u00ad\3\2\2\2 \u00af\3\2\2\2\"\u00b7"+
		"\3\2\2\2$\u00c2\3\2\2\2&\u00d4\3\2\2\2(\u00ec\3\2\2\2*\u00fe\3\2\2\2,"+
		"\u0129\3\2\2\2.\u0134\3\2\2\2\60\u0139\3\2\2\2\62\u0148\3\2\2\2\64\u014c"+
		"\3\2\2\2\66\u0150\3\2\2\28\u0158\3\2\2\2:;\7\f\2\2;<\7\6\2\2<\3\3\2\2"+
		"\2=A\7\6\2\2>A\5\2\2\2?A\7\b\2\2@=\3\2\2\2@>\3\2\2\2@?\3\2\2\2A\5\3\2"+
		"\2\2BC\t\2\2\2C\7\3\2\2\2DE\t\3\2\2E\t\3\2\2\2FG\t\4\2\2G\13\3\2\2\2H"+
		"_\5\4\3\2IK\7\f\2\2JI\3\2\2\2JK\3\2\2\2KL\3\2\2\2L_\7\n\2\2MS\5\4\3\2"+
		"NP\7\f\2\2ON\3\2\2\2OP\3\2\2\2PQ\3\2\2\2QS\7\n\2\2RM\3\2\2\2RO\3\2\2\2"+
		"S[\3\2\2\2TW\5\b\5\2UX\5\6\4\2VX\7\n\2\2WU\3\2\2\2WV\3\2\2\2XZ\3\2\2\2"+
		"YT\3\2\2\2Z]\3\2\2\2[Y\3\2\2\2[\\\3\2\2\2\\_\3\2\2\2][\3\2\2\2^H\3\2\2"+
		"\2^J\3\2\2\2^R\3\2\2\2_\r\3\2\2\2`a\b\b\1\2ag\5\f\7\2bc\7\17\2\2cd\5\16"+
		"\b\2de\7\20\2\2eg\3\2\2\2f`\3\2\2\2fb\3\2\2\2gn\3\2\2\2hi\f\3\2\2ij\5"+
		"\b\5\2jk\5\16\b\4km\3\2\2\2lh\3\2\2\2mp\3\2\2\2nl\3\2\2\2no\3\2\2\2o\17"+
		"\3\2\2\2pn\3\2\2\2qx\5\16\b\2rs\7\f\2\2st\7\17\2\2tu\5\16\b\2uv\7\20\2"+
		"\2vx\3\2\2\2wq\3\2\2\2wr\3\2\2\2x\21\3\2\2\2yz\7\t\2\2z{\7\17\2\2{\u0080"+
		"\5\24\13\2|}\7\26\2\2}\177\5\24\13\2~|\3\2\2\2\177\u0082\3\2\2\2\u0080"+
		"~\3\2\2\2\u0080\u0081\3\2\2\2\u0081\u0083\3\2\2\2\u0082\u0080\3\2\2\2"+
		"\u0083\u0084\7\20\2\2\u0084\23\3\2\2\2\u0085\u008c\7\n\2\2\u0086\u008c"+
		"\7\t\2\2\u0087\u008c\5\4\3\2\u0088\u008c\5\20\t\2\u0089\u008c\5\22\n\2"+
		"\u008a\u008c\7\4\2\2\u008b\u0085\3\2\2\2\u008b\u0086\3\2\2\2\u008b\u0087"+
		"\3\2\2\2\u008b\u0088\3\2\2\2\u008b\u0089\3\2\2\2\u008b\u008a\3\2\2\2\u008c"+
		"\25\3\2\2\2\u008d\u009b\7\t\2\2\u008e\u008f\7\t\2\2\u008f\u0090\7\17\2"+
		"\2\u0090\u0095\5\24\13\2\u0091\u0092\7\26\2\2\u0092\u0094\5\24\13\2\u0093"+
		"\u0091\3\2\2\2\u0094\u0097\3\2\2\2\u0095\u0093\3\2\2\2\u0095\u0096\3\2"+
		"\2\2\u0096\u0098\3\2\2\2\u0097\u0095\3\2\2\2\u0098\u0099\7\20\2\2\u0099"+
		"\u009b\3\2\2\2\u009a\u008d\3\2\2\2\u009a\u008e\3\2\2\2\u009b\27\3\2\2"+
		"\2\u009c\u009d\7\t\2\2\u009d\u009e\7\17\2\2\u009e\u009f\5\4\3\2\u009f"+
		"\u00a0\7\25\2\2\u00a0\u00a1\5\4\3\2\u00a1\u00a2\7\20\2\2\u00a2\31\3\2"+
		"\2\2\u00a3\u00a7\5\26\f\2\u00a4\u00a5\7\f\2\2\u00a5\u00a7\5\26\f\2\u00a6"+
		"\u00a3\3\2\2\2\u00a6\u00a4\3\2\2\2\u00a7\33\3\2\2\2\u00a8\u00a9\7\3\2"+
		"\2\u00a9\u00aa\5\32\16\2\u00aa\35\3\2\2\2\u00ab\u00ae\5\32\16\2\u00ac"+
		"\u00ae\5\34\17\2\u00ad\u00ab\3\2\2\2\u00ad\u00ac\3\2\2\2\u00ae\37\3\2"+
		"\2\2\u00af\u00b4\5\24\13\2\u00b0\u00b1\7\26\2\2\u00b1\u00b3\5\24\13\2"+
		"\u00b2\u00b0\3\2\2\2\u00b3\u00b6\3\2\2\2\u00b4\u00b2\3\2\2\2\u00b4\u00b5"+
		"\3\2\2\2\u00b5!\3\2\2\2\u00b6\u00b4\3\2\2\2\u00b7\u00bc\5\32\16\2\u00b8"+
		"\u00b9\7\26\2\2\u00b9\u00bb\5\32\16\2\u00ba\u00b8\3\2\2\2\u00bb\u00be"+
		"\3\2\2\2\u00bc\u00ba\3\2\2\2\u00bc\u00bd\3\2\2\2\u00bd#\3\2\2\2\u00be"+
		"\u00bc\3\2\2\2\u00bf\u00c0\5 \21\2\u00c0\u00c1\7\30\2\2\u00c1\u00c3\3"+
		"\2\2\2\u00c2\u00bf\3\2\2\2\u00c2\u00c3\3\2\2\2\u00c3\u00c4\3\2\2\2\u00c4"+
		"\u00ce\5\"\22\2\u00c5\u00c9\7\33\2\2\u00c6\u00c7\5 \21\2\u00c7\u00c8\7"+
		"\30\2\2\u00c8\u00ca\3\2\2\2\u00c9\u00c6\3\2\2\2\u00c9\u00ca\3\2\2\2\u00ca"+
		"\u00cb\3\2\2\2\u00cb\u00cd\5\"\22\2\u00cc\u00c5\3\2\2\2\u00cd\u00d0\3"+
		"\2\2\2\u00ce\u00cc\3\2\2\2\u00ce\u00cf\3\2\2\2\u00cf%\3\2\2\2\u00d0\u00ce"+
		"\3\2\2\2\u00d1\u00d2\5 \21\2\u00d2\u00d3\7\30\2\2\u00d3\u00d5\3\2\2\2"+
		"\u00d4\u00d1\3\2\2\2\u00d4\u00d5\3\2\2\2\u00d5\u00d6\3\2\2\2\u00d6\u00d7"+
		"\5\"\22\2\u00d7\u00d8\7\30\2\2\u00d8\u00e5\5\"\22\2\u00d9\u00dd\7\33\2"+
		"\2\u00da\u00db\5 \21\2\u00db\u00dc\7\30\2\2\u00dc\u00de\3\2\2\2\u00dd"+
		"\u00da\3\2\2\2\u00dd\u00de\3\2\2\2\u00de\u00df\3\2\2\2\u00df\u00e0\5\""+
		"\22\2\u00e0\u00e1\7\30\2\2\u00e1\u00e2\5\"\22\2\u00e2\u00e4\3\2\2\2\u00e3"+
		"\u00d9\3\2\2\2\u00e4\u00e7\3\2\2\2\u00e5\u00e3\3\2\2\2\u00e5\u00e6\3\2"+
		"\2\2\u00e6\'\3\2\2\2\u00e7\u00e5\3\2\2\2\u00e8\u00ea\5\24\13\2\u00e9\u00eb"+
		"\5\n\6\2\u00ea\u00e9\3\2\2\2\u00ea\u00eb\3\2\2\2\u00eb\u00ed\3\2\2\2\u00ec"+
		"\u00e8\3\2\2\2\u00ec\u00ed\3\2\2\2\u00ed\u00ef\3\2\2\2\u00ee\u00f0\7#"+
		"\2\2\u00ef\u00ee\3\2\2\2\u00ef\u00f0\3\2\2\2\u00f0\u00f1\3\2\2\2\u00f1"+
		"\u00f2\7\23\2\2\u00f2\u00f3\5$\23\2\u00f3\u00f8\7\24\2\2\u00f4\u00f6\5"+
		"\n\6\2\u00f5\u00f4\3\2\2\2\u00f5\u00f6\3\2\2\2\u00f6\u00f7\3\2\2\2\u00f7"+
		"\u00f9\5\24\13\2\u00f8\u00f5\3\2\2\2\u00f8\u00f9\3\2\2\2\u00f9)\3\2\2"+
		"\2\u00fa\u00fc\5\24\13\2\u00fb\u00fd\5\n\6\2\u00fc\u00fb\3\2\2\2\u00fc"+
		"\u00fd\3\2\2\2\u00fd\u00ff\3\2\2\2\u00fe\u00fa\3\2\2\2\u00fe\u00ff\3\2"+
		"\2\2\u00ff\u0101\3\2\2\2\u0100\u0102\7#\2\2\u0101\u0100\3\2\2\2\u0101"+
		"\u0102\3\2\2\2\u0102\u0103\3\2\2\2\u0103\u0104\7\23\2\2\u0104\u0105\5"+
		"&\24\2\u0105\u010a\7\24\2\2\u0106\u0108\5\n\6\2\u0107\u0106\3\2\2\2\u0107"+
		"\u0108\3\2\2\2\u0108\u0109\3\2\2\2\u0109\u010b\5\24\13\2\u010a\u0107\3"+
		"\2\2\2\u010a\u010b\3\2\2\2\u010b+\3\2\2\2\u010c\u010e\7\f\2\2\u010d\u010c"+
		"\3\2\2\2\u010d\u010e\3\2\2\2\u010e\u010f\3\2\2\2\u010f\u0110\7\n\2\2\u0110"+
		"\u0112\5\n\6\2\u0111\u0113\7\f\2\2\u0112\u0111\3\2\2\2\u0112\u0113\3\2"+
		"\2\2\u0113\u0114\3\2\2\2\u0114\u0115\7\n\2\2\u0115\u012a\3\2\2\2\u0116"+
		"\u0117\7\n\2\2\u0117\u0118\5\n\6\2\u0118\u0119\7\4\2\2\u0119\u012a\3\2"+
		"\2\2\u011a\u011c\7\f\2\2\u011b\u011a\3\2\2\2\u011b\u011c\3\2\2\2\u011c"+
		"\u011d\3\2\2\2\u011d\u0120\7\n\2\2\u011e\u0120\5\20\t\2\u011f\u011b\3"+
		"\2\2\2\u011f\u011e\3\2\2\2\u0120\u0121\3\2\2\2\u0121\u0127\5\n\6\2\u0122"+
		"\u0124\7\f\2\2\u0123\u0122\3\2\2\2\u0123\u0124\3\2\2\2\u0124\u0125\3\2"+
		"\2\2\u0125\u0128\7\n\2\2\u0126\u0128\5\20\t\2\u0127\u0123\3\2\2\2\u0127"+
		"\u0126\3\2\2\2\u0128\u012a\3\2\2\2\u0129\u010d\3\2\2\2\u0129\u0116\3\2"+
		"\2\2\u0129\u011f\3\2\2\2\u012a-\3\2\2\2\u012b\u0130\5\32\16\2\u012c\u012d"+
		"\7\27\2\2\u012d\u012f\5\32\16\2\u012e\u012c\3\2\2\2\u012f\u0132\3\2\2"+
		"\2\u0130\u012e\3\2\2\2\u0130\u0131\3\2\2\2\u0131\u0135\3\2\2\2\u0132\u0130"+
		"\3\2\2\2\u0133\u0135\5*\26\2\u0134\u012b\3\2\2\2\u0134\u0133\3\2\2\2\u0135"+
		"/\3\2\2\2\u0136\u013a\5\36\20\2\u0137\u013a\5,\27\2\u0138\u013a\5(\25"+
		"\2\u0139\u0136\3\2\2\2\u0139\u0137\3\2\2\2\u0139\u0138\3\2\2\2\u013a\u0143"+
		"\3\2\2\2\u013b\u013f\7\26\2\2\u013c\u0140\5\36\20\2\u013d\u0140\5,\27"+
		"\2\u013e\u0140\5(\25\2\u013f\u013c\3\2\2\2\u013f\u013d\3\2\2\2\u013f\u013e"+
		"\3\2\2\2\u0140\u0142\3\2\2\2\u0141\u013b\3\2\2\2\u0142\u0145\3\2\2\2\u0143"+
		"\u0141\3\2\2\2\u0143\u0144\3\2\2\2\u0144\61\3\2\2\2\u0145\u0143\3\2\2"+
		"\2\u0146\u0149\5.\30\2\u0147\u0149\5\30\r\2\u0148\u0146\3\2\2\2\u0148"+
		"\u0147\3\2\2\2\u0149\u014a\3\2\2\2\u014a\u014b\7\5\2\2\u014b\63\3\2\2"+
		"\2\u014c\u014d\7\31\2\2\u014d\u014e\5\60\31\2\u014e\u014f\7\5\2\2\u014f"+
		"\65\3\2\2\2\u0150\u0151\5.\30\2\u0151\u0152\7\31\2\2\u0152\u0153\5\60"+
		"\31\2\u0153\u0154\7\5\2\2\u0154\67\3\2\2\2\u0155\u0159\5\62\32\2\u0156"+
		"\u0159\5\64\33\2\u0157\u0159\5\66\34\2\u0158\u0155\3\2\2\2\u0158\u0156"+
		"\3\2\2\2\u0158\u0157\3\2\2\2\u01599\3\2\2\2\62@JORW[^fnw\u0080\u008b\u0095"+
		"\u009a\u00a6\u00ad\u00b4\u00bc\u00c2\u00c9\u00ce\u00d4\u00dd\u00e5\u00ea"+
		"\u00ec\u00ef\u00f5\u00f8\u00fc\u00fe\u0101\u0107\u010a\u010d\u0112\u011b"+
		"\u011f\u0123\u0127\u0129\u0130\u0134\u0139\u013f\u0143\u0148\u0158";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}