(function(app){
  const main=document.querySelector('main');
  if(!main||document.getElementById('aboutPage'))return;

  const page=document.createElement('section');
  page.id='aboutPage';
  page.className='page about-page';
  page.innerHTML=`
    <div class="page-head about-heading">
      <div>
        <span class="about-kicker">GreenTime Pro</span>
        <h2>Om appen</h2>
        <p>En enkel løsning til planlægning og tidsregistrering i et mindre firma.</p>
      </div>
      <span class="about-version">Version 3.5</span>
    </div>

    <article class="card about-intro">
      <div class="about-icon" aria-hidden="true">🌿</div>
      <div>
        <h3>Hvad kan GreenTime Pro?</h3>
        <p>Appen samler kunder, medarbejdere, arbejdsopgaver, kalender og tidsforbrug ét sted. Den kan bruges på computer, iPhone og Android-telefoner.</p>
      </div>
    </article>

    <h3 class="about-section-title">Sådan kommer du i gang</h3>
    <ol class="about-steps">
      <li><span>1</span><div><strong>Opret kunder</strong><p>Tilføj kundens navn, adresse, kontaktoplysninger og noter om arbejdet.</p></div></li>
      <li><span>2</span><div><strong>Opret medarbejdere</strong><p>Tilføj dem, der skal kunne planlægges og registrere tid. Lars W er oprettet som chef i demoen.</p></div></li>
      <li><span>3</span><div><strong>Planlæg opgaver</strong><p>Vælg dato, klokkeslæt, kunde og de medarbejdere, som skal udføre opgaven.</p></div></li>
      <li><span>4</span><div><strong>Registrér tiden</strong><p>Start tidtagningen under Overblik, eller indtast arbejdstiden manuelt med dato og klokkeslæt.</p></div></li>
      <li><span>5</span><div><strong>Se og eksportér</strong><p>Brug Rapporter til at filtrere timer efter periode, kunde eller medarbejder og hente dem som CSV.</p></div></li>
    </ol>

    <div class="about-grid">
      <article class="card"><span class="feature-icon">📅</span><h3>Plan & kalender</h3><p>Dage med aftaler markeres i kalenderen. Tryk på en dato for at se eller oprette dagens bookinger.</p></article>
      <article class="card"><span class="feature-icon">⏱️</span><h3>Tidsregistrering</h3><p>Registrér arbejdstid direkte eller manuelt. Vælg altid kunde og den eller de medarbejdere, tiden gælder for.</p></article>
      <article class="card"><span class="feature-icon">↩️</span><h3>Navigation</h3><p>Brug Tilbage til forrige side og husknappen til Overblik. På mobil åbnes resten af menuen med ☰.</p></article>
      <article class="card"><span class="feature-icon">💾</span><h3>Data og sikkerhedskopi</h3><p>Demoversionens data gemmes lokalt på enheden. Hent jævnligt en sikkerhedskopi under Indstillinger.</p></article>
    </div>

    <article class="card about-note">
      <h3>Vigtigt om demoversionen</h3>
      <p>Data deles endnu ikke automatisk mellem flere telefoner og computere. En senere driftsversion bør bruge login og en fælles database, så alle medarbejdere arbejder med de samme oplysninger.</p>
    </article>
  `;
  main.appendChild(page);
  app.initAbout=()=>{};
})(window.GTP);
