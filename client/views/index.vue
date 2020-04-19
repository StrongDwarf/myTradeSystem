<template>
    
</template>
<script>
    export default {
        mounted(){
            if(this.$store.state.token){
                if(this.$store.state.token == '1'){
                    this.$router.push("/interviewer")
                }else if(this.$store.token == '2'){
                    this.$router.push('/candidater')
                }
            }else{
                this.$router.push("login")
            }
        }
    }
</script>