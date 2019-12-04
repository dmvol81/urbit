/-  spider, dns
/+  strandio, libdns=dns
=,  strand=strand:spider
^-  thread:spider
|=  arg=vase
|^
=/  m  (strand ,vase)
^-  form:m
=+  !<  [adr=address:dns ~]  arg
::
;<  our=ship  bind:m  get-our:strandio
=/  rac  (clan:title our)
?.  ?=(?(%king %duke) rac)
  ~|  [%dns-collector-bind-invalid rac]  !!
::
?:  (reserved:eyre if.adr)
  ~|  [%dns-collector-reserved-address if.adr]  !!
;<  ~         bind:m  (request-by-ip if.adr)
;<  ~         bind:m  take-fact
(pure:m *vase)
::
++  request-by-ip
  |=  if=@if
  =/  m  (strand ,~)
  ^-  form:m
  =/  collector-app  `dock`[~zod %dns-collector]
  ;<  good=?  bind:m  (self-check-http:libdns |+if 2)
  ?.  good
    ::  XX details
    ~|  %bail-early-failed-self-check  !!
  ;<  ~       bind:m  (poke:strandio collector-app %dns-address !>([%if if]))
  =/  msg=cord
    (cat 3 'request for DNS sent to ' (scot %p p:collector-app))
  ;<  ~       bind:m  (app-message:strandio %dns msg ~)
  ;<  our=@p  bind:m  get-our:strandio
  ;<  ~       bind:m  (watch:strandio /sub collector-app /(scot %p our))
  =/  msg=cord
    (cat 3 'awaiting response from ' (scot %p p:collector-app))
  ;<  ~       bind:m  (app-message:strandio %dns msg ~)
  (pure:m ~)
::
++   take-fact
  =/  m  (strand ,~)
  ^-  form:m
  ;<  our=ship  bind:m  get-our:strandio
  ;<  =cage     bind:m  (take-fact:strandio /(scot %p our))
  ?>  ?=(%dns-binding p.cage)
  =/  =binding:dns  !<(binding:dns q.cage)
  ;<  good=?    bind:m  (turf-confirm-install:libdns turf.binding)
  =/  msg=(pair cord tang)
    ?:  good
      [(cat 3 'confirmed access via ' (en-turf:html turf.binding)) ~]
    :-  (cat 3 'unable to access via ' (en-turf:html turf.binding))
    :~  leaf+"XX check via nslookup"
        leaf+"XX confirm port 80"
    ==
  ;<  ~         bind:m  (app-message:strandio %dns msg)
  (pure:m ~)
--
