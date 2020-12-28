import React, { Component } from 'react';
import Auxx from '../../hoc/Auxx/Auxx';
import { connect } from 'react-redux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import axios from '../../axios-orders';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'; 
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        // axios.get('https://react-my-burger-2b358-default-rtdb.firebaseio.com/ingredients.json')
        // .then(response => {
        //      this.setState({ingredients: response.data});
        // })
        // .catch(error => {
        //     this.setState({error: true})
        // });
    }
    updatePurchaseState (ingredients) {
        const sum= Object.keys(ingredients)
        .map(igkey => {
            return ingredients[igkey]
        })
        .reduce((sum, el) => {
            return sum + el;
        }, 0);
        return sum > 0;
    }
    
    purchaseHandler = () => {
        this.setState({purchasing: true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }
    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cant be loaded</p> : <Spinner />;
        if (this.props.ings) {
        burger = ( <Auxx>
        <Burger ingredients={this.props.ings} />
        <BuildControls  
          ingredientAdded= {this.props.onIngredientAdded}
          ingredientRemoved= {this.props.onIngredientRemoved}
          disabled= {disabledInfo}
          ordered={this.purchaseHandler} 
          purchasable={this.updatePurchaseState(this.props.ings)}
          price={this.props.price} />
           </Auxx>
          );
          orderSummary = <OrderSummary ingredients={this.props.ings}
        price={this.props.price}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler} />;
        }
        if (this.state.loading) {
             orderSummary = <Spinner />;
            }
        return(
            <Auxx>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Auxx>
        );
        
    }
}
      const mapStateToProps = state => {
        return {
        ings: state.ingredients,
        price: state.totalPrice
        };     
      }

      const mapDispatchToProps = dispatch => {
        return {
            onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
            onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
        };     
      }


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));