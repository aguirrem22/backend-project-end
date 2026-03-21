const { Categories: categories, Sizes: sizes } = require("../models/Product");

function renderProductCards(products, isDashboard = false) {
  if (!products.length) {
    return "<p>No hay productos disponibles.</p>";
  }

  return `
	<section class="grid">
	${products
    .map(
      (product) => `
		<article class="card" data-product-id="${product._id}">
		<img src="${product.imagen}" alt="${product.nombre}" />
	<div class="card-body">
		<h3>${product.nombre}</h3>
		${isDashboard ? `<p class="muted">${product.categoria} · ${product.talla}</p><p>${product.precio.toFixed(2)} €</p>` : ""}
		<div class="row">
		<a class="btn-view" href="${isDashboard ? `/dashboard/${product._id}` : `/products/${product._id}`}">Ver</a>
		${
      isDashboard
        ? `<a class="btn-edit" href="/dashboard/${product._id}/edit">Editar</a>
		<button class="danger" onclick="deleteProduct(\`${product._id}\`)">Eliminar</button>`
        : ""
    }
	</div>
	</div>
	</article> `,
    )
    .join("")}
	</section>`;
}

function renderProductForm(product, action, method = "POST", title = "Nuevo producto", buttonLabel = "Guardar", errorMessage = "") {
  const selectedCategory = product?.categoria || "Camisetas";
  const selectedSize = product?.talla || "M";
  const methodOverride =
    method !== "POST"
      ? `<input type="hidden" name="_method" value="${method}" />`
      : "";

  return `
		<section class="form-wrapper">
			<h1>${title}</h1>
			${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ""}
			<form action="${action}" method="POST" class="stack">
				${methodOverride}
				<label>Nombre<input name="nombre" value="${product?.nombre || ""}" required /></label>
				<label>Descripción<textarea name="descripcion" required>${product?.descripcion || ""}</textarea></label>
				<label>Imagen (URL)<input name="imagen" type="url" value="${product?.imagen || ""}" required /></label>
				<label>Categoría
					<select name="categoria" required>
				${categories
          .map(
            (category) =>
              `<option value="${category}" ${selectedCategory === category ? "selected" : ""}>${category}</option>`,
          )
          .join("")}
					</select>
				</label>
				<label>Talla
					<select name="talla" required>
						${sizes
              .map(
                (size) =>
                  `<option value="${size}" ${selectedSize === size ? "selected" : ""}>${size}</option>`,
              )
              .join("")}
					</select>
				</label>
				<label>Precio<input name="precio" type="number" min="0" step="0.01" value="${product?.precio || ""}" required /></label>
				<button type="submit">${buttonLabel}</button>
			</form>
		</section>
	`;
    
}

const renderProductDetail = (product, isDashboard = false) => {
	const price = Number(product.precio || 0).toFixed(2);
	return `
		<section class="detail">
			<img src="${product.imagen}" alt="${product.nombre}" />
			<div class="detail-body">
				<h1>${product.nombre}</h1>
				<p class="muted">${product.categoria} - ${product.talla}</p>
				<p>${product.descripcion}</p>
				<p>${price} €</p>
				${isDashboard
					? `
					<div class="row">
						<a class="btn-edit" href="/dashboard/${product._id}/edit">Editar</a>
						<button class="danger" onclick="deleteProduct('${product._id}')">Eliminar</button>
					</div>
					`
					: ''}
			</div>
		</section>
	`;
};
// Formulario de login
const renderLoginForm = () => {
	return `
		<section class="form-wrapper">
			<h1>Iniciar Sesión</h1>
			<form action="/login" method="POST" class="stack">
				<label>Usuario<input name="username" type="text" required /></label>
				<label>Contraseña<input name="password" type="password" required /></label>
				<button type="submit">Entrar</button>
			</form>
		</section>
	`;
};

// Formulario para crear admin
const renderAdminForm = (action = "/dashboard/admin", errorMessage = "") => {
	return `
		<section class="form-wrapper">
			<h1>Crear Nuevo Administrador</h1>
			${errorMessage ? `<p class="error-message">${errorMessage}</p>` : ""}
			<form action="${action}" method="POST" class="stack">
				<label>
					Usuario
					<input name="username" type="text" placeholder="Nombre de usuario" required />
				</label>
				<label>
					Contraseña
					<input name="password" type="password" placeholder="Contraseña segura" required />
				</label>
				<button type="submit">Crear Administrador</button>
			</form>
		</section>
	`;
};

module.exports = {
  renderProductCards,
  renderProductForm,
  renderProductDetail,
  renderLoginForm,
  renderAdminForm,
};
