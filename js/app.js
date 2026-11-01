/* ============================================================
   app.js — interactions de la galerie SlowSite
   Révélation des vignettes au scroll + nuage de mots-clés.
   JavaScript natif, sans dépendance (ui-kit.min.js retiré, cf. rapport).
   ============================================================ */
(function () {
  'use strict';

  /* Équivalents natifs des 4 helpers de ui-kit réellement utilisés. */
  function qs(s) { return document.querySelector(s); }
  function qsa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* Vocabulaire d'indexation de la photothèque. */
  var TAGS = [
    'portrait', 'paysage', 'nature morte', 'macro', 'architecture', 'photo de rue',
    'reportage', 'documentaire', 'animalier', 'sport', 'mode', 'culinaire', 'spectacle',
    'concert', 'mariage', 'corporate', 'packshot', 'astrophotographie', 'sous-marine',
    'aérienne', 'urbex', 'industrielle', 'scolaire', 'studio', 'autoportrait', 'street art',
    'botanique', 'ornithologie', 'minéralogie', 'scène de genre', 'pose longue', 'filé',
    'bokeh', 'contre-jour', 'panoramique', 'focus stacking', 'light painting',
    'surimpression', 'sténopé', 'lomographie', 'time-lapse', 'hyperlapse', 'photogramme',
    'solarisation', 'bracketing', 'rafale', 'mise au point manuelle', 'hyperfocale',
    'profondeur de champ', 'flou de bougé', 'zoom burst', 'réflexion', 'silhouette',
    'ombre portée', 'symétrie miroir', 'levée de voile', 'prise de vue au flash',
    'seconde synchro', 'multi-exposition', 'vue éclatée', 'heure dorée', 'heure bleue',
    'lumière rasante', 'lumière diffuse', 'clair-obscur', 'éclairage Rembrandt',
    'éclairage papillon', 'lumière naturelle', 'flash déporté', 'boîte à lumière',
    'réflecteur', 'nid d\'abeille', 'gélatine colorée', 'stroboscope', 'low key',
    'high key', 'halo', 'contre-jour partiel', 'lumière d\'appoint', 'fond lumineux',
    'ombre douce', 'ombre dure', 'lumière zénithale', 'lumière latérale',
    'lumière frontale', 'pénombre', 'rétroéclairage', 'faisceau', 'diffuseur', 'snoot',
    'grand angle', 'téléobjectif', 'focale fixe', 'zoom transstandard', 'fisheye',
    'tilt-shift', 'trépied', 'monopode', 'rotule ball', 'filtre polarisant', 'filtre ND',
    'filtre dégradé', 'pare-soleil', 'télémètre', 'reflex', 'hybride', 'moyen format',
    'grand format', 'chambre photographique', 'flash cobra', 'bague allonge', 'soufflet',
    'doubleur de focale', 'déclencheur souple', 'viseur optique', 'viseur électronique',
    'carte mémoire', 'batterie de secours', 'sac photo', 'courroie', 'pellicule',
    'format 35 mm', 'format 120', 'négatif', 'diapositive', 'tirage argentique',
    'laboratoire', 'révélateur', 'fixateur', 'agrandisseur', 'planche contact',
    'papier baryté', 'papier RC', 'virage sépia', 'cyanotype', 'platinotypie',
    'gomme bichromatée', 'collodion humide', 'daguerréotype', 'sels d\'argent',
    'grain argentique', 'poussée de développement', 'bain d\'arrêt', 'séchage', 'spire',
    'cuve de développement', 'chambre noire', 'inactinique', 'chimie', 'archivage',
    'monochrome', 'sépia', 'désaturé', 'couleurs saturées', 'teintes froides',
    'teintes chaudes', 'balance des blancs', 'colorimétrie', 'étalonnage', 'courbe tonale',
    'niveaux', 'dominante bleue', 'dominante verte', 'duotone', 'trichromie', 'pastel',
    'contraste élevé', 'contraste doux', 'noir profond', 'blanc pur', 'gris neutre',
    'palette restreinte', 'complémentaires', 'camaïeu', 'teinte unique', 'virage croisé',
    'rendu cinéma', 'rendu neutre', 'rendu chaud', 'aplat', 'règle des tiers',
    'nombre d\'or', 'lignes de fuite', 'symétrie', 'cadre dans le cadre', 'point de fuite',
    'diagonale dominante', 'premier plan', 'arrière-plan', 'perspective forcée',
    'contre-plongée', 'plongée', 'hauteur d\'homme', 'cadrage serré', 'plan large',
    'plan d\'ensemble', 'gros plan', 'plan américain', 'format carré', 'format panoramique',
    'orientation portrait', 'orientation paysage', 'espace négatif', 'répétition',
    'rythme visuel', 'point focal', 'ligne d\'horizon', 'décentrage',
    'remplissage du cadre', 'hors-champ', 'montagne', 'littoral', 'forêt', 'désert',
    'ville', 'village', 'ruelle', 'marché', 'port', 'gare', 'friche', 'chantier', 'champ',
    'vignoble', 'rivière', 'cascade', 'lac', 'falaise', 'dune', 'marais', 'sentier', 'pont',
    'phare', 'moulin', 'ruines', 'cloître', 'verrière', 'escalier', 'façade', 'toiture',
    'aube', 'crépuscule', 'nuit étoilée', 'brume', 'brouillard', 'pluie', 'orage', 'neige',
    'givre', 'vent', 'ciel dégagé', 'arc-en-ciel', 'nuages bas', 'cumulus', 'éclaircie',
    'averse', 'gel matinal', 'canicule', 'embruns', 'rosée', 'halo lunaire', 'voie lactée',
    'aurore', 'éclipse', 'mirage', 'poussière', 'sable soulevé', 'reflet mouillé', 'flaque',
    'vapeur', 'recadrage', 'retouche', 'densité', 'masque de fusion', 'calque de réglage',
    'accentuation', 'réduction de bruit', 'correction optique', 'redressement', 'détourage',
    'tampon', 'correcteur localisé', 'dématriçage', 'fichier brut', 'export web',
    'profil colorimétrique', 'netteté de sortie', 'vignetage', 'aberration chromatique',
    'distorsion', 'moiré', 'clarté', 'texture', 'suppression de poussières', 'fusion HDR',
    'assemblage panoramique', 'upscaling', 'compression', 'métadonnées', 'mots-clés',
    'tirage d\'exposition', 'accrochage', 'encadrement', 'passe-partout', 'portfolio',
    'série', 'diptyque', 'triptyque', 'édition limitée', 'numérotation', 'vernissage',
    'résidence', 'commande', 'cession de droits', 'droit à l\'image', 'légende',
    'fonds photographique', 'inventaire', 'numérisation', 'conservation'
  ];

  /* Alimente les suggestions du champ de filtrage avec le vocabulaire
     d'indexation de la photothèque. */
  function buildKeywordIndex() {
    var list = qs('#motscles');
    if (!list) return;

    // Une seule insertion dans le DOM : `innerHTML +=` dans la boucle
    // relisait et re-parsait toute la liste à chaque tour (coût en n²).
    var frag = document.createDocumentFragment();
    for (var i = 0; i < TAGS.length; i++) {
      var opt = document.createElement('option');
      opt.value = TAGS[i];
      frag.appendChild(opt);
    }
    list.textContent = '';
    list.appendChild(frag);
  }

  /* Construit le calendrier d'activité : 53 semaines de 7 jours, la teinte de
     chaque case reflétant le nombre de prises de vue archivées ce jour-là. */
  function buildActivityCalendar() {
    var host = qs('#calendrier');
    if (!host) return;

    var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
                'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    var fin = new Date(Date.UTC(2026, 8, 30));
    var frag = document.createDocumentFragment();

    for (var i = 370; i >= 0; i--) {
      var jour = new Date(fin.getTime() - i * 86400000);
      var n = activite(jour);
      var cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.setAttribute('data-n', String(n));
      cell.title = n === 0
        ? 'Aucune prise de vue le ' + jour.getUTCDate() + ' ' + MOIS[jour.getUTCMonth()]
        : n + ' prise' + (n > 1 ? 's' : '') + ' de vue le ' + jour.getUTCDate() +
          ' ' + MOIS[jour.getUTCMonth()];
      frag.appendChild(cell);
    }
    host.appendChild(frag);
  }

  /* Niveau d'activité d'une journée, de 0 à 4. Les sorties sont plus
     nombreuses le week-end et à la belle saison. */
  function activite(jour) {
    var j = jour.getUTCDay();
    var mois = jour.getUTCMonth();
    var graine = (jour.getUTCFullYear() * 372 + mois * 31 + jour.getUTCDate()) * 2654435761;
    var bruit = ((graine >>> 13) % 100) / 100;
    var poids = (j === 0 || j === 6 ? 0.45 : 0.12) +
                (mois >= 4 && mois <= 8 ? 0.28 : 0.05) + bruit * 0.45;
    if (poids < 0.35) return 0;
    if (poids < 0.6) return 1;
    if (poids < 0.8) return 2;
    if (poids < 0.95) return 3;
    return 4;
  }

  /* Filtre la galerie sur les mots-clés associés à chaque visuel. */
  function filterGallery() {
    var champ = qs('#q');
    var info = qs('#filter-info');
    if (!champ) return;

    var q = champ.value.trim().toLowerCase();
    var cards = qsa('.card');
    var visibles = 0;

    for (var i = 0; i < cards.length; i++) {
      var mots = (cards[i].getAttribute('data-mots') || '').toLowerCase();
      var match = !q || mots.indexOf(q) !== -1;
      cards[i].style.display = match ? '' : 'none';
      if (match) visibles++;
    }

    if (info) {
      if (!q) {
        info.textContent = '';
      } else if (!visibles) {
        // Le vocabulaire couvre tout le fonds, pas seulement cette sélection.
        info.textContent = 'Aucun visuel de la sélection pour « ' + champ.value.trim() + ' »';
      } else {
        info.textContent = visibles + ' visuel' + (visibles > 1 ? 's' : '') +
                           ' sur ' + cards.length;
      }
    }
  }

  /* Anime l'arrivée des cartes dans le viewport.
     IntersectionObserver : le navigateur calcule lui-même l'intersection,
     sans lecture géométrique dans un gestionnaire de scroll. Une carte
     révélée n'est plus observée. La marge basse de -40 px reproduit
     l'ancien test « rect.top < innerHeight - 40 ». */
  function revealCards() {
    var cards = qsa('.card');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        // Comme avant : une carte déjà passée au-dessus de l'écran est révélée.
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -40px 0px' });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* Hauteur de la plus grande carte, pour garder une grille régulière.
     Toutes les lectures, puis toutes les écritures : un seul calcul de mise
     en page (avant : offsetHeight relu pour chaque carte, à l'intérieur
     d'une boucle sur les cartes, entre deux écritures de style → n² reflows
     forcés à chaque événement scroll). Ne dépend pas du scroll : recalculé
     seulement au chargement et au redimensionnement. */
  function equalizeCards() {
    var cards = qsa('.card');
    if (!cards.length) return;
    cards.forEach(function (c) { c.style.minHeight = ''; });   // écritures
    var tallest = 0;
    cards.forEach(function (c) {                               // lectures
      if (c.offsetHeight > tallest) tallest = c.offsetHeight;
    });
    cards.forEach(function (c) { c.style.minHeight = tallest + 'px'; }); // écritures
  }

  /* Les cases du calendrier apparaissent progressivement à l'approche
     (opacité selon la distance au centre de l'écran, comme avant).
     Les 7 cases d'une même ligne ont toujours la même position verticale :
     au lieu de lire getBoundingClientRect() sur 371 cases à chaque cran de
     molette, on lit une seule position (le haut de la grille) et on écrit
     7 propriétés CSS sur le conteneur, une par ligne (voir .calendar dans
     styles.css). */
  var calendrier = null;
  var PAS_LIGNE = 11 + 3; // hauteur d'une case + gouttière (cf. styles.css)
  var dernieres = [];     // dernières valeurs écrites, pour ne rien réécrire d'identique
  function fadeCalendar() {
    if (!calendrier) return;
    var top = calendrier.getBoundingClientRect().top;  // une seule lecture
    var h = window.innerHeight;
    for (var r = 0; r < 7; r++) {
      var d = Math.abs(top + r * PAS_LIGNE - h / 2);
      var o = Math.max(0.15, 1 - d / h).toFixed(3);
      // Loin de l'écran, toutes les lignes sont à 0.15 : rien à écrire.
      if (o !== dernieres[r]) {
        calendrier.style.setProperty('--o' + r, o);
        dernieres[r] = o;
      }
    }
  }

  /* Au plus une mise à jour par image affichée (requestAnimationFrame). */
  var prevu = false;
  function onScroll() {
    if (prevu) return;
    prevu = true;
    requestAnimationFrame(function () { prevu = false; fadeCalendar(); });
  }
  var prevuResize = false;
  function onResize() {
    if (prevuResize) return;
    prevuResize = true;
    requestAnimationFrame(function () { prevuResize = false; equalizeCards(); fadeCalendar(); });
  }

  /* Affiche les images une fois chargées. */
  function watchImages() {
    qsa('.card img').forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('loaded');
        });
      }
    });
  }

  function init() {
    buildKeywordIndex();
    buildActivityCalendar();
    watchImages();
    revealCards();
    equalizeCards();
    calendrier = qs('#calendrier');
    fadeCalendar();
    var champ = qs('#q');
    if (champ) champ.addEventListener('input', filterGallery);
  }
  // Script chargé en defer : le DOM est déjà analysé. Repli si chargé autrement.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // passive : on n'appelle jamais preventDefault(), le navigateur peut
  // défiler sans attendre ce code.
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('load', function () { equalizeCards(); fadeCalendar(); });
})();
