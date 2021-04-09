// Generated from C:/Users/ZFC/Desktop/aspexp/asp-explainer/src/main/resources\ASP.g4 by ANTLR 4.9.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link ASPParser}.
 */
public interface ASPListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link ASPParser#negative_int}.
	 * @param ctx the parse tree
	 */
	void enterNegative_int(ASPParser.Negative_intContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#negative_int}.
	 * @param ctx the parse tree
	 */
	void exitNegative_int(ASPParser.Negative_intContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#integer}.
	 * @param ctx the parse tree
	 */
	void enterInteger(ASPParser.IntegerContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#integer}.
	 * @param ctx the parse tree
	 */
	void exitInteger(ASPParser.IntegerContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#natural_number}.
	 * @param ctx the parse tree
	 */
	void enterNatural_number(ASPParser.Natural_numberContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#natural_number}.
	 * @param ctx the parse tree
	 */
	void exitNatural_number(ASPParser.Natural_numberContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#arithmetic_op}.
	 * @param ctx the parse tree
	 */
	void enterArithmetic_op(ASPParser.Arithmetic_opContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#arithmetic_op}.
	 * @param ctx the parse tree
	 */
	void exitArithmetic_op(ASPParser.Arithmetic_opContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#relation_op}.
	 * @param ctx the parse tree
	 */
	void enterRelation_op(ASPParser.Relation_opContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#relation_op}.
	 * @param ctx the parse tree
	 */
	void exitRelation_op(ASPParser.Relation_opContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#simple_arithmetic_expr}.
	 * @param ctx the parse tree
	 */
	void enterSimple_arithmetic_expr(ASPParser.Simple_arithmetic_exprContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#simple_arithmetic_expr}.
	 * @param ctx the parse tree
	 */
	void exitSimple_arithmetic_expr(ASPParser.Simple_arithmetic_exprContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#simple_arithmetic_expr2}.
	 * @param ctx the parse tree
	 */
	void enterSimple_arithmetic_expr2(ASPParser.Simple_arithmetic_expr2Context ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#simple_arithmetic_expr2}.
	 * @param ctx the parse tree
	 */
	void exitSimple_arithmetic_expr2(ASPParser.Simple_arithmetic_expr2Context ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#arithmethic_expr}.
	 * @param ctx the parse tree
	 */
	void enterArithmethic_expr(ASPParser.Arithmethic_exprContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#arithmethic_expr}.
	 * @param ctx the parse tree
	 */
	void exitArithmethic_expr(ASPParser.Arithmethic_exprContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#function}.
	 * @param ctx the parse tree
	 */
	void enterFunction(ASPParser.FunctionContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#function}.
	 * @param ctx the parse tree
	 */
	void exitFunction(ASPParser.FunctionContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#term}.
	 * @param ctx the parse tree
	 */
	void enterTerm(ASPParser.TermContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#term}.
	 * @param ctx the parse tree
	 */
	void exitTerm(ASPParser.TermContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#atom}.
	 * @param ctx the parse tree
	 */
	void enterAtom(ASPParser.AtomContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#atom}.
	 * @param ctx the parse tree
	 */
	void exitAtom(ASPParser.AtomContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#range_atom}.
	 * @param ctx the parse tree
	 */
	void enterRange_atom(ASPParser.Range_atomContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#range_atom}.
	 * @param ctx the parse tree
	 */
	void exitRange_atom(ASPParser.Range_atomContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#literal}.
	 * @param ctx the parse tree
	 */
	void enterLiteral(ASPParser.LiteralContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#literal}.
	 * @param ctx the parse tree
	 */
	void exitLiteral(ASPParser.LiteralContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#default_literal}.
	 * @param ctx the parse tree
	 */
	void enterDefault_literal(ASPParser.Default_literalContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#default_literal}.
	 * @param ctx the parse tree
	 */
	void exitDefault_literal(ASPParser.Default_literalContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#extended_literal}.
	 * @param ctx the parse tree
	 */
	void enterExtended_literal(ASPParser.Extended_literalContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#extended_literal}.
	 * @param ctx the parse tree
	 */
	void exitExtended_literal(ASPParser.Extended_literalContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#term_tuple}.
	 * @param ctx the parse tree
	 */
	void enterTerm_tuple(ASPParser.Term_tupleContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#term_tuple}.
	 * @param ctx the parse tree
	 */
	void exitTerm_tuple(ASPParser.Term_tupleContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#literal_tuple}.
	 * @param ctx the parse tree
	 */
	void enterLiteral_tuple(ASPParser.Literal_tupleContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#literal_tuple}.
	 * @param ctx the parse tree
	 */
	void exitLiteral_tuple(ASPParser.Literal_tupleContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#aggregate_elements}.
	 * @param ctx the parse tree
	 */
	void enterAggregate_elements(ASPParser.Aggregate_elementsContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#aggregate_elements}.
	 * @param ctx the parse tree
	 */
	void exitAggregate_elements(ASPParser.Aggregate_elementsContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#aggregate_elements_condition}.
	 * @param ctx the parse tree
	 */
	void enterAggregate_elements_condition(ASPParser.Aggregate_elements_conditionContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#aggregate_elements_condition}.
	 * @param ctx the parse tree
	 */
	void exitAggregate_elements_condition(ASPParser.Aggregate_elements_conditionContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#body_aggregate}.
	 * @param ctx the parse tree
	 */
	void enterBody_aggregate(ASPParser.Body_aggregateContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#body_aggregate}.
	 * @param ctx the parse tree
	 */
	void exitBody_aggregate(ASPParser.Body_aggregateContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#head_aggregate}.
	 * @param ctx the parse tree
	 */
	void enterHead_aggregate(ASPParser.Head_aggregateContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#head_aggregate}.
	 * @param ctx the parse tree
	 */
	void exitHead_aggregate(ASPParser.Head_aggregateContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#relation_expr}.
	 * @param ctx the parse tree
	 */
	void enterRelation_expr(ASPParser.Relation_exprContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#relation_expr}.
	 * @param ctx the parse tree
	 */
	void exitRelation_expr(ASPParser.Relation_exprContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#head}.
	 * @param ctx the parse tree
	 */
	void enterHead(ASPParser.HeadContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#head}.
	 * @param ctx the parse tree
	 */
	void exitHead(ASPParser.HeadContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#body}.
	 * @param ctx the parse tree
	 */
	void enterBody(ASPParser.BodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#body}.
	 * @param ctx the parse tree
	 */
	void exitBody(ASPParser.BodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#fact}.
	 * @param ctx the parse tree
	 */
	void enterFact(ASPParser.FactContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#fact}.
	 * @param ctx the parse tree
	 */
	void exitFact(ASPParser.FactContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#constraint}.
	 * @param ctx the parse tree
	 */
	void enterConstraint(ASPParser.ConstraintContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#constraint}.
	 * @param ctx the parse tree
	 */
	void exitConstraint(ASPParser.ConstraintContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#full_rule}.
	 * @param ctx the parse tree
	 */
	void enterFull_rule(ASPParser.Full_ruleContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#full_rule}.
	 * @param ctx the parse tree
	 */
	void exitFull_rule(ASPParser.Full_ruleContext ctx);
	/**
	 * Enter a parse tree produced by {@link ASPParser#hard_rule}.
	 * @param ctx the parse tree
	 */
	void enterHard_rule(ASPParser.Hard_ruleContext ctx);
	/**
	 * Exit a parse tree produced by {@link ASPParser#hard_rule}.
	 * @param ctx the parse tree
	 */
	void exitHard_rule(ASPParser.Hard_ruleContext ctx);
}