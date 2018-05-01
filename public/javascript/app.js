var ingredientList = [];

$("#add-ingredient").on("click", function(event){
    console.log("CALLED");
        var ingredient = $("#ingredientName").val();
        var quantity = $("#quantity").val();
        $("#ingredientName").val("");
		$("#quantity").val("");
		//create a new li and add to ul
        $("#ingredientList").append("<li>" + ingredient  + " - " + quantity + "</li>")
        
        ingredientList.push({
            name:ingredient,
            quantity:quantity
        });
        $("#hidden-ingredient").val(ingredientList);
        ingredientList.forEach(element => {
            console.log(element.name + element.quantity);
        });

	
});
