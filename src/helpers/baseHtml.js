function baseHtml(title, body) {
	return `
		<!DOCTYPE html>
		<html lang="es">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>${title}</title>
				<link rel="stylesheet" href="/styles.css" />
			</head>
			<body>
				<video autoplay muted loop playsinline class="background-video" media="(min-width: 1025px)">
					<source src="https://a.venum.com/f/117261/x/cfbb1a3834/vdef-banniere-kai-asakura-desk-1.mp4" type="video/mp4">
				</video>
				<div class="video-overlay"></div>
				${body}
				<script>
					// Detectar si es móvil y desactivar video si es necesario
					const video = document.querySelector('.background-video');
					const isMobile = window.innerWidth <= 1024;
					
					if (isMobile && video) {
						video.style.display = 'none';
					}

					async function deleteProduct(productId) {
						if (confirm('¿Estás seguro de eliminar este producto?')) {
							try {
								const url = '/dashboard/' + productId + '/delete';
								const response = await fetch(url, { method: 'DELETE' });
								if (response.ok) {
									const article = document.querySelector('[data-product-id="' + productId + '"]');
									if (article) article.remove();
								}
							} catch (error) {
								console.error('Error al eliminar:', error);
								alert('Error al eliminar el producto');
							}
						}
					}
				</script>
			</body>
		</html>
	`;
}

module.exports = baseHtml;