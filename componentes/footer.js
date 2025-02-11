//COMPONENTE HTML
class piePagina extends HTMLElement{
    constructor(){
        super(); // Extiende del padre 
        this.name;//Este va si o si
        this.anio;
    }
    static get observedAttributes(){
        return ['name', "anio"];
    }

	// cuando recibe parametros actualiza
    attributeChangedCallback(nameAttr, oldValue, newValue){
		//Implementacion del tutorial     
		switch(nameAttr){
		    case "name":
		        this.name = newValue;
		    break;
		    case "anio":
		        this.anio = newValue;
		    break;
		}
    }
	connectedCallback(){
	//Esas comillitas ` ` son la posta
		this.innerHTML =`<div class="container-fluid px-4">
			<div class="d-flex align-items-center justify-content-between small">
				<div class="text-muted">Copyright &copy; ${this.name} ${this.anio}</div>
				<div
				    <a href="#">Desarrollado por</a>
				    &middot
				    <a href="www.ondabyte.com.ar">OndaByte</a>
				    <!--a href="#">Terms &amp; Conditions</a-->
				</div>
			</div>
		</div>`
	}
}

//TUKI
window.customElements.define("pie-pagina", piePagina);
