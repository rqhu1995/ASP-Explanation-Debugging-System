// Generated from ASP.g4 by ANTLR 4.8
package cn.seu.kse.util.parser;
import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link ASPParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface ASPVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link ASPParser#negative_int}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNegative_int(ASPParser.Negative_intContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#integer}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitInteger(ASPParser.IntegerContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#natural_number}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNatural_number(ASPParser.Natural_numberContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#arithmetic_op}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitArithmetic_op(ASPParser.Arithmetic_opContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#relation_op}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitRelation_op(ASPParser.Relation_opContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#simple_arithmetic_expr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSimple_arithmetic_expr(ASPParser.Simple_arithmetic_exprContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#simple_arithmetic_expr2}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSimple_arithmetic_expr2(ASPParser.Simple_arithmetic_expr2Context ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#arithmethic_expr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitArithmethic_expr(ASPParser.Arithmethic_exprContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#function}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFunction(ASPParser.FunctionContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#term}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTerm(ASPParser.TermContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#atom}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAtom(ASPParser.AtomContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#range_atom}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitRange_atom(ASPParser.Range_atomContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#literal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLiteral(ASPParser.LiteralContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#default_literal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDefault_literal(ASPParser.Default_literalContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#extended_literal}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitExtended_literal(ASPParser.Extended_literalContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#term_tuple}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTerm_tuple(ASPParser.Term_tupleContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#literal_tuple}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLiteral_tuple(ASPParser.Literal_tupleContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#aggregate_elements}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAggregate_elements(ASPParser.Aggregate_elementsContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#aggregate_elements_condition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAggregate_elements_condition(ASPParser.Aggregate_elements_conditionContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#body_aggregate}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBody_aggregate(ASPParser.Body_aggregateContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#head_aggregate}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitHead_aggregate(ASPParser.Head_aggregateContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#relation_expr}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitRelation_expr(ASPParser.Relation_exprContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#head}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitHead(ASPParser.HeadContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#body}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitBody(ASPParser.BodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#fact}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFact(ASPParser.FactContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#constraint}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitConstraint(ASPParser.ConstraintContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#full_rule}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFull_rule(ASPParser.Full_ruleContext ctx);
	/**
	 * Visit a parse tree produced by {@link ASPParser#hard_rule}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitHard_rule(ASPParser.Hard_ruleContext ctx);
}