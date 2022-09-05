<script>
  export let name;
  export let value;

  function toDollars(number) {
    const formatter = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR"
    });

    return formatter.format(number);
  }
</script>

<div class="card">
  <div class="name">{name}</div>
  <div class="price {value.direction}">{toDollars(value.price)}</div>
</div>

<style>
  .card {
    border-radius: 5px;
    width: 15%;
    padding: 25px;
    margin: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    cursor: default;
  }

  .card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .name {
    text-transform: uppercase;
    margin-bottom: 5px;
    word-wrap: break-word;
  }

  .up {
    color: green;
  }

  .down {
    color: red;
  }
</style>