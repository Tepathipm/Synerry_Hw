<script setup>
import { onBeforeMount, reactive, ref} from 'vue';
import { RouterLink} from 'vue-router';
const fetchback = import.meta.env.VITE_ROOT_API
const url = ref('')
const showAllUrl = reactive([])
const qrCode = '/45Bath.jpg'
const shortUrl = ref('')
const longUrl = ref('')

onBeforeMount( async() => {
  await getShortUrl()
  shortUrl.value = ''
})

const sendUrl = async()=>{
  try{
    const res = await fetch(`${fetchback}/shorturl`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        longUrl:url.value
      })
    })
    if(res.ok){
      console.log('ok')
      const data = await res.json()
      for(const i of data){
        shortUrl.value = `https://shorturl.mm/${i.shortUrl}`
      }
      url.value = ''
    }
    if(res.status===400){
      const errMsg = await res.json()
      alert(errMsg.error)
      url.value = ''
    }
  } catch(err){
    alert(err)
  }
}

const getShortUrl = async()=>{
  try{
    const res = await fetch(`${fetchback}/shorturl`,{
      headers:{
        'Content-Type': 'application/json'
      }
    })
    if(res.ok){
      const data = await res.json();
      showAllUrl.push(...data)
      console.log(showAllUrl)
      for(const i of data){
        shortUrl.value = i.shortUrl
      }
      url.value = ''
    }
    if(res.status === 400){
      const errMsg = await res.json
      alert(errMsg.error)
    }
  } catch(err){
    alert(err)
  }
}

const toRedirect = async() => {
  const shortUrlRe = shortUrl.value
  try{
    const res = await fetch(`${fetchback}/shorturl/${shortUrlRe}`,{
      headers:{
        'Content-Type': 'application/json'
      }
    })
    if(res.ok){
      const data = await res.json();

    }
  } catch(err){
    alert(err)
  }
}

</script>

<template>
  <div class="w-screen h-screen relative bg-black">
    <div class="header absolute flex flex-col w-full h-1/2 mt-7 items-start justify-start space-y-10 border border-white">
      <div class="title font-semibold text-8xl text-center text-white">Make Your Short</div>
      <div class="content flex flex-row items-center justify-center h-full border-2 border-red-500">
        <input type="text" class="inputUrl w-full border rounded" v-model="url" placeholder="Enter URL">
        <button class="btn text-white border rounded bg-purple-400" @click="sendUrl">Send URL</button>
      </div>
      <div class="showShort text-white">shorted URL : 
        <router-Link to="/" class="" @click="to">{{ shortUrl }}</router-Link></div>
    </div>
    <div class="qrCode absolute flex flex-col items-center justify-center border-2 border-orange-400 h-1/2 w-1/4">
      <img :src="qrCode" alt="qrCode" class="qrCodeImg">
    </div>
    <div class="tableToShow absolute w-full h-1/2 border border-cyan-500 text-white text-center">
      <table class="table-auto h-full w-full border border-red-400">
        <thead>
          <tr class="border-grey-300 border-b rounded-2xl h-14 text-gray-300">
            <th class="border border-white">NO.</th>
            <th class="border border-white">SHORTURL</th>
            <th class="border border-white">NUMBER OF CLICKS</th>
            <th class="border border-white">QR CODE</th>
          </tr>
        </thead>
        <tbody class="">
          <tr class="text-white text-center " v-for="(items, index) in showAllUrl" :key="items.id" >
            <td >{{ index + 1 }}</td>
            <td>{{ items.shortUrl }}</td>
            <td >{{ items.numOfClick }}</td>
            <td class="flex text-center justify-center items-center"><img :src="qrCode" alt="qrCode" class="w-1/12 h-1/12"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.header {
  margin: 0 auto;
  padding: 3rem;
}

.tableToShow {
  margin: 0 auto;
  padding: 3rem;
  bottom: 0;
}

.qrCodeImg{
 width: 65%;
 height: 65%; 
}
.content{
  width: 65%;
}
.inputUrl{
  height: 30%;
}
.btn{
  width: 6rem;
  height: 30%;
}

.qrCode{
  right: 4%;
}
</style>
