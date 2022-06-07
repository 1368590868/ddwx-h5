<template>
    <div class="not-empty">
        <dl>
            <dt class="not-image"></dt>
            <dd>
                <h3 class="not-title">{{title}}</h3>
                <p>{{text}}</p>
            </dd>
        </dl>
    </div>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        text: {
            type: String,
            default: ""
        }

    }
}

</script>