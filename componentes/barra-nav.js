class barraNav extends HTMLElement{
    constructor(){
        super();
        this.name;
    }

    static get observedAttributes(){
        return ['name'];
    }

    attributeChangedCallback(nameAttr, oldValue, newValue){
        switch(nameAttr){
            default:
            break;
        }
    }

    connectedCallback(){
        this.innerHTML = `
		<nav class="sb-topnav navbar navbar-expand navbar-dark bg-light">
		<!-- Navbar Brand-->
		<div class="btn bg-primary p-2 mx-3 text-center">
		    <a class="navbar-brand text-dark" href="caja.html">Mister Queso</a> 
		</div> 
		<!-- Sidebar Toggle>
		<button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"><i class="fas fa-bars"></i></button>
		<!-- Navbar Search-->
		<!--form class="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
			<div class="input-group">
				<input class="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
				<button class="btn btn-primary" id="btnNavbarSearch" type="button"><i class="fas fa-search"></i></button>
			</div>
		</form-->
		<!-- Navbar-->
		<ul class="navbar-nav">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle dark" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fas fa-user fa-fw"></i></a>
				<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
					<!--li><a class="dropdown-item" href="#!">Settings</a></li>
					<li><a class="dropdown-item" href="#!">Activity Log</a></li>
					<li><hr class="dropdown-divider" /></li-->
					<li><a class="dropdown-item" href="/Cerrar">Salir</a></li>
				</ul>
			</li>
		</ul>
	</nav>`;
        this.style.backgroundColor = "#26a626;";
        //this.style.fontFamily = "sans-serif";
/*
<div>
    <h1>Hola ${this.name} ${this.surname}</h1>
    <p>Esto es un párrafo</p>
</div>
*/
    }
}

window.customElements.define("barra-nav", barraNav);
