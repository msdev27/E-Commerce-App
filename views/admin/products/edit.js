const layout = require('../layout');
const { getErrors } = require('../../helpers');

module.exports = ({ product, errors }) => {
    return layout({
        content: `
          <div class="columns is-centered">
            <div class="column is-half">
              <h1 class="subtitle">Edit a Product</h1>
    
              <form method="POST" enctype="multipart/form-data">
                <div class="field">
                  <label class="label">Title</label>
                  <input value="${product.productName}" class="input" placeholder="Title" name="productName">
                  <p class="help is-danger">${getErrors(errors, 'productName')}</p>
                </div>
                
                <div class="field">
                  <label class="label">Price</label>
                  <input value="${product.productPrice}" class="input" placeholder="Price" name="productPrice">
                  <p class="help is-danger">${getErrors(errors, 'productPrice')}</p>
                </div>
                
                <div class="field">
                  <label class="label">Image</label>            
                  <input type="file" name="productImage" />
                </div>
                <br />
                <button class="button is-primary">Edit</button>
              </form>
            </div>
          </div>
    `
    });
};
