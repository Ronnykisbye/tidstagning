(function(app){
  const KEY='gtp_manager_bio_v1';
  const randomBytes=length=>crypto.getRandomValues(new Uint8Array(length));
  const toBase64Url=value=>btoa(String.fromCharCode(...new Uint8Array(value))).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');
  const fromBase64Url=value=>Uint8Array.from(atob(value.replaceAll('-','+').replaceAll('_','/')+'==='.slice((value.length+3)%4)),char=>char.charCodeAt(0));
  function record(){try{return JSON.parse(localStorage.getItem(KEY));}catch{return null;}}
  async function supported(){
    if(!window.isSecureContext||!window.PublicKeyCredential||!navigator.credentials)return false;
    if(!PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable)return true;
    return PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }
  async function setup(employee){
    if(!employee)throw new Error('Der mangler en medarbejderprofil.');
    if(!await supported())throw new Error('Denne enhed understøtter ikke sikker enhedsgodkendelse i browseren.');
    const userId=randomBytes(32);
    const credential=await navigator.credentials.create({publicKey:{
      challenge:randomBytes(32),
      rp:{name:'GreenTime Pro',id:location.hostname},
      user:{id:userId,name:`greentime-${employee.id}`,displayName:employee.name},
      pubKeyCredParams:[{type:'public-key',alg:-7},{type:'public-key',alg:-257}],
      authenticatorSelection:{authenticatorAttachment:'platform',residentKey:'preferred',userVerification:'required'},
      timeout:60000,attestation:'none'
    }});
    if(!credential)throw new Error('Oprettelsen blev afbrudt.');
    const publicKey=credential.response.getPublicKey?.();
    const saved={credentialId:toBase64Url(credential.rawId),employeeId:employee.id,createdAt:new Date().toISOString(),publicKey:publicKey?toBase64Url(publicKey):'',algorithm:credential.response.getPublicKeyAlgorithm?.()||null};
    localStorage.setItem(KEY,JSON.stringify(saved));return saved;
  }
  async function verify(employeeId){
    const saved=record();if(!saved)throw new Error('Sikker enhedsgodkendelse er ikke aktiveret.');
    if(employeeId&&saved.employeeId!==employeeId)throw new Error('Denne sikkerhedsnøgle tilhører en anden medarbejder på enheden.');
    const assertion=await navigator.credentials.get({publicKey:{challenge:randomBytes(32),allowCredentials:[{type:'public-key',id:fromBase64Url(saved.credentialId)}],userVerification:'required',timeout:60000}});
    if(!assertion||toBase64Url(assertion.rawId)!==saved.credentialId)throw new Error('Godkendelsen kunne ikke bekræftes.');
    return true;
  }
  app.bio={supported,enrolled:()=>Boolean(record()),enrolledFor:employeeId=>Boolean(record()&&record().employeeId===employeeId),record,setup,verify,remove(){localStorage.removeItem(KEY);}};
})(window.GTP);
