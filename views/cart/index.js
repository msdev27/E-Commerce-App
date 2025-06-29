const layout = require('../layout');

module.exports = ({ cartProducts }) => {
    let totalCartValue = cartProducts.reduce((sum, cartProduct) => {
        return sum + (cartProduct.productPrice * cartProduct.productQuantity);
    }, 0);
    const renderedItems = cartProducts
        .map(cartProduct => {
            return `
        <div class="cart-item message">
          <h3 class="subtitle">${cartProduct.productName}</h3>
          <div class="cart-right">
            <div>
              $${cartProduct.productPrice}  X  ${cartProduct.productQuantity} = 
            </div>
            <div class="price is-size-4">
              $${cartProduct.productPrice * cartProduct.productQuantity}
            </div>
            <div class="remove">
              <form method="POST" action="/cart/delete">
                <input hidden value="${cartProduct.productId}" name="cartProductId"/>
                <button class="button is-danger">                  
                  <span class="icon is-small">
                    <i class="fas fa-times"></i>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      `;
        })
        .join('');

    return layout({
        content: `
      <div id="cart" class="container">
        <div class="columns">
          <div class="column"></div>
          <div class="column is-four-fifths">
            <h3 class="subtitle"><b>Shopping Cart</b></h3>
            <div>
              ${renderedItems}
            </div>
            <div class="total message is-info">
              <div class="message-header">
                Total
              </div>
              <h1 class="title">$${totalCartValue}</h1>
              <button class="button is-primary">Buy</button>
            </div>
          </div>
          <div class="column"></div>
        </div>
      </div>
    `
    });
};
