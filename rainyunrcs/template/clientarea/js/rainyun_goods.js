(function() {
  'use strict';

  var natConfig = {
    'cn-sq1': true,   
    'cn-cq1': false,  
  };


  var noTrialRegions = [
    // 'cn-sq1',
    // 'cn-cq1',
  ];

  var osInfoMap = {
    debian:{
        name: "Debian",
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAqFBMVEUAAAADAAEMAAMIAAKlAC8GAAIPAAQ3AA8oAAunAC9oAB1JABWhAC5kABxLABUvAA0iAAp0ACFeABtDABMsAAwTAAWUACqSACl6ACJbABpXABhHABQ8ABEaAAcXAAYKAAOjAC6bACyPACmCACU/ABIzAA6fAC1/ACRtAB5SABclAAsdAAidAC2aACyIACdxACBOABYgAAmXACuLACd3ACKFACaWACuoADDVP6CqAAAAN3RSTlMABRMN+wkXVDz9nm/0l3JINLCQZkMd4d25ioRsWycjD/js2cZhTvLBpX05LO7pz6x4MObUtcrkXYQQeAAAAxlJREFUWMPtltmWojAQhsMuKCIubArt0u771v/7v9mYlpFjIEiPuZg5Z/4bj0n5WamqpIr8k5Jk7V1EEkb7qLs6KkSX38B0XRNUfuBvxmrQUf4MY+zAaNZOiCz91JsrCmSe0Gj9KLxtcDWzq6Ns5lTqrPH0NZKqubPAQ5vQWR/pz+TVYLF5LF+0Khz3YT8KP552pnOkCpQfcIbuKrc7mKWb85c+WamlbxQGIh6n+/YLTi212/U4Br2v1GJaypFP93pxB1yT9SYNoF4GWoLqa1XqdFoLFs8gToi2pRYTnZSqnpZTwvsnhfSpgfuy3Cb3rC65Bn3qdMBwOBnZJGGHt/9BOROmQLgurT8GZWffFsRH77T39nJNMnVoiHprjj+E1togj7GGOC3a9mS+ztZMasp5NFtd3GSwy0cP1upeY5/Z5hiY1UlxFDR6Oc45f7aek5Xrw4cAQIsUp0XaFJxMuniFB2gCaJNiOTTU7H/YQ/Y5zKJ94IDo6xqyN1TlFN1nyf0/AOiycLPHB6mcPXo9YqYiZkEut9nRJoQPUpiehGYukg/31YgParA9EgY/oH6Lf0H8XCTqHOOIJkbigiY5j+Zs1aafC6Cv8EH73HPhMeWQZkNpYKTIpDJIUc3kqc7r2n3dBiLCAzUBl12bI+TkRdWJxgflqsbAKO21Sb2ZvVQLjDs01Nxi9XJN7ILF7+KMM0sVA8LXFECNadCa7qFT0LJ2tRLQEWAL2Ynl1tB8XtRd4FI6Qmgq0Mm9mkltC0vP8midAPtFnzkDV3ZNcqbxGbNo/U3pHjxgZFSYQ/yCHrbv0qnIC4L5EEAjlF+PscUjRm8/6dhXCsHJ/awyIssqsIuL+otdryly0qs8Z7sAzKgwEc7y0J9WBn03NjUm74u22pEjANTETW+CsnHE1wSQDrjpKAAknelYLwkg1QD6BAmQBSASAZK/AHUlgnRsAJ4ugjQ1gZFGBJXlkohQG1ANXYhPJuDLIkjG8EaaiiCttsCCiJBsmbg6ighU7QyM+yJIUn0MM5SIEK+sxs6QhaAUp2m1P1sa+a+/SL8Ao8GEb5laAHYAAAAASUVORK5CYII=`
    },
    ubuntu:{
        name: "Ubuntu",
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAA0lBMVEUAAACrOA9AFQYIAgHaRxTVRRPRRBPNQxO4PBGmNg+JLAx+KQt6KAtyJQpuJApjIAlNGQdEFgY1EQUqDgQkDAMZCAIDAQAyEAUxEATdSBT////53dPvqZD//Pv76uTuoIXeTRr99PD539bsl3njZzzfUyLfUB7++fjgVib88e3zvKnwrpf20ML2zL3hWiv99vT42MzytaDqjm3mdU7lcEjiYTTzv63upYv87ur649vrknPog2DogV3meFLka0HtnIDpiWjpiGbhXjD0w7L0wrHzvqs9zM58AAAAGXRSTlMAxkoJ+/by7NTAnpKNhIByWU49MSkdBDo5kanQzQAAAmRJREFUWMPs1GtT2kAYBeAGFblfRKHnJQJJSCBcRUCLVGtt+///Urubhr6by4LUT47PF4ZhOJM9ObOfPrw/J41atVIqVaq1xsnxIfViDkyuWD8m7KKQRUy2cPHKmIyBFEbmFTGXeWjkLw+MaZZPoXVabh6Sc2VgL+Nqf07rHAc4b+1t+QzpvOWji8BZZk+Orp7vFtHACYvSJrV0z7MiaRs+02dNz9p+fpB0s+sptfGmgSTucDYUnxuS5ggZaSsoI+bJnPr0hz+5xZSkNnbKKXuOFf3Ypp0OtiQ5bJnJG89D5WJ9Tf/c4l58XYDJJ755qLodD2MWNFih7zhPUCRtwADX+0lkYmixpGtzDcx64IyE+weKX+KffThEN6OxeWcHh7R8uoMifj8VwN2TMEHv4QXSsNuhQBdcIXavZsEsKdDnhw0LW4LJRm/fOrh2UMozFNtBOCSmHgkqgnkg6SsinsMhMMVIUA6MTcICMSYJNphcpCIw/WDKHmI8P1Yd1JIaYLokfAOj/mSCaShBNUgvo4099lzZ9QwJ3L+zYGpKUBXC2pIV9Fb82lFt5KnBVJWgCoRpOLk28QVzi8Hc8r/w+ipKUAnCnKQJRkoPeqW3Dvr/ox1Xtq0rm7/+35MjPfrJSpD2WBIkOVlEwQJnFqE805JTjDhiK0bIKNhsCBdslBe1hAt/PQKFP6HqSAu5OjLXklbHXx1RXkHSpsqmvBFBebOG5IaWhS7hhhblTT/KG6OUNY9t4M1jmjfYCXchVI1tNRBdCAJAgrhOjQR9ulmUd/wo74pS3jmmvLtO+QAC5UMao2DYAQA5Ph/5k6wPsgAAAABJRU5ErkJggg==`
    },
    centos:{
        name: "Centos",
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABL1BMVEUAAAAICAgsLCv7+/n6+frb5rvUts/w8+rbvdDt27y8utDw3rrv6e69vs/18eoqKio0MzNRUVHn5+x0dHMxMjH08vX4+PLp6e7o6O3y8enS0t/k0N/n7tH06NHw6u/o6O3IyNjdxtjg6cfw4cfX5Lm6uc7s2rl3dnYbGxsZGRm+v8+TInkmJXeczSrvpyS83W30w2n///9sbKT2++23aqW1Z6OoTZNRUJKv11TyuE7s7PP+9+y6canA33f1x3P8/Pv16/NqaaL6+vv9/fn27PN0dKj+/f2WKHwtLHufzzDvqit3dqrr6vL99+qlR5BLSo6t1U78+fvytknytUfvqCdzc6i5udOamsDf77v647m8dqzR6Jz41pnC4Hv1yXfcuNTas9HOm8LNmMFzcqdpaaH4z9o6AAAAK3RSTlMACC38/Pf29vf39vb29vYrNVH0dTL7+/b19fn5+fn39vT09PTx8PB5Gxn3Nks69gAAAuNJREFUWMPl2OlT00AYx/ESCvXAHvZAOZT7sOm2T8t9NJjaiCIIWrnB8///G8yTSn+7iWmaSV8ww/fVvsh8JrPPTmY2sYedpvXJIdL64iTr9aTWF0cISNEcSNEcSJEdll6mojqQIjvhpQG5dPL2I9cSouUsbpM55YEuDg1KkdXgqCJEhQzOorgUDfhDg6VOx7Xd9mKIoUdFp529o2KneDAEBxCkEBAcQJDCQHAAQQoBWeclN9TpuxUC2qiV/aCVd2shIEiA4PQIHVsbkADJzhodBUPHtfMaJECys/dj7ygI4nmVIQGSnVWeXXfImTskQKpTZKkrxI4sAVIdlrpAOWJHkQApDkuU9nNSIwYjqnQHwbnLGNX8nEtAkNoQnE4nB6//K2kjO+8BQZpgaBwOoP3fkBSnCEiSGtdCXJ/AkSD92wtIkgNIlmYKlUphGo4MQZIdQIo0lyXKDsORIVsa1dwOQzSkNtGYmaNMOp2h4emT8WE1YkhvypL2yna4FXc/84uZpVhsKbOYP6u6Y0eRNLIdn1baxy5Nf3S/mqSFgaq+0AFD2CKnVXe/8tnMciy2nMnmz966++dgcNJmP1EbM6fm25u9MNuYfKxG+3Dc4zd1perWuq7P8/gXhNjcrgglY5+d53AgAYKjTxXK5cKsgASInRQMSIDgrJtXpdJVYxMSIDguCRCcrbGyfcQntyEBguOSLk2vU33G0NOKVzI8Dg644XX0NiS8kgHHXZqaHucO8kh1yvl//M1PTZcDyCXVDwcH/KH4Z5YUBxAkx/naFdJZgqNCkNgR3SFbOoWjQpAubCcAsiULjgpBsmwnCOLgAFKklgiG4HghSL1C1qnuB4kLq9UzxLPzg+qHX0K8ESRAcEJAkADBCQVBegMIThBEcWSSYXLEEDU4S730APJKcrnEzQeuZOcsbhI+16ygUondktRuIvy1FlIkB2mQ4ESQ4ESS4ESV4ESVbOc+/fZxfkQ96P4CtU2u+e2WjYAAAAAASUVORK5CYII=`
    },
    windows:{
        name: "Windows",
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOdSURBVHhe7ZtNaBNREMe7+dhN+pGvpjVpWtsmjWILgi0ievFS6kWkFFEUvHgRPejNgyfBQ9VTqxfFgyfBm4IgFunBi7di68WbWDyIoqK20lrTXWfeTjZbmu4mko/dZH5hmXlvZ7d9f2behrx9LQzDMAzDMAxTDIlsw+JV2sJKNJUNxHr36DaVFRaOxdmpGIXtSEMI5JGD7YFIz5ACgw9EQQiTCL7WcBeFbWPh1oTt+F0jkMenBJVoMpMfuAIZISwc/vZYksLKwnUCSV6frESSaUMEtFQacijeCxEV/X8dKZDk8fnlUPduJZJIr3x8+0rbzG20JfceHDxx7bESTgyABh4KrTp1E8irtIaUMGZCTwYyIiNjVoDFNooDGngxbnFmKrr5Z/VHaGB0PHv65ktxcQ2pnkAwQn97Z1IMOiJEMATAzPAFw3GKtKRhBOoem7xM2SCEkMOJQY9PDtDp/8YNApVU733jl2ZRpHDm0PFA5+59lRDHLdRsQiyKVPuHRLnUVyAXwALZwALZwALZwALZUFeB4CHGTzG3U6JAmkZO08EZZAMLZEN9BZJ4knY9pQmkwadJ4QyygQWyoaRJcvTqixzMpx5N01T4SgQFBxYdTYU2flQVahD7weh94hwYjMVItNRGhP/u4cUDufWV722p4cP9x67c12Px+oIV90YLjuhT1c0dz5n7THbrfQt9y3MzF2iIDFMlSiqx4fP3lvBLC5aFnqLiQFf3C/1Yafl0pvICHzoprRFREui/fzZ9Vt1YWw3G+0diI+Pn9L+G4H10hyx2CR9vqrdN54w+4zqA4i3iPr1+dEO0LShjDtLXsipJflUjkj0ymZm6/oS6a0bFVjWaGacIZCoDZ8EZZEN9Bcqvi22ZXJ2FIzLIeDI5EC4xG5whEJeYe6mrQKZlH84gt+IQgXgOsoYnaffiCIEgfTiDisLrYiXi9jno6+LzByvLb+Y3fn7+AIPBXwibhrJTHPdTyKFd/fm36MWL5LjJRLxQnkjjphMKtWXpzsl4bu3Xt9Dg2ET21PQcddeMOmxFkCTceVN4655EJDF9wVAnBQqaUCBrxOY2k3hfFp7eVf+u/+7o2380e+b2fDV+97bCcQJZYewCivYM4REQNjUEQsKRTGNpU2jFcJVAVmBm+Tu6egvCoWiQheSXM++ZaRiBrKF5zxCPso58rxzsoMBtNIlAVkgS7lk1hENL4gWgXcqmXoZhGIZhGIYpQkvLP8gRrggNN7NPAAAAAElFTkSuQmCC`
    },
    rocky_linux:{
        name: "RockyLinux",
        logo: `data:image/png;base64,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`
    },
    alpine_linux:{
        name: "AlpineLinux",
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAwCAMAAACCABLMAAAByFBMVEUAAAAAAAAAgIAAVVUAQIAAVYAASW0AYIAaTYAXXXQVVYASW4ARVXcQYIAPWngOVYANXnkNWYALWXoLVYAKWIAJVXsJW4AJWHsRVYAQWnsQWIAPXXwPWoAPV3wOXIANV4ANWYAMWX0MV4ALW30LWYALV30LWoAPV4APWn0PWIAOWoAOWH0NW30NWYAMWX0MWIALWoAPV4AOWn4NWH4MWoAMWX4MWH4OWIAOWYAOWH4OWoANWoANWn4NWYANWH4MWX4MWn4MWYAMWH4OWX4OWH4NWYANWX4NWIANWX4NWYANWX4NWoAMV34MWX4MWn4MWH4OWoAOWIAOWn8OWYANWX8NWX8NWYANWYANWoAMWYAMWH8OWX8OWIAOWn8NWH8NWX8NWYANWX8NWoANWX8MWYAMWn8OWYANWX8NWYANWX8NWoANWX8MWYANWYANWX8NWX8NWIANWH8NWYANWYAOWX8NWYANWYANWYANWX8NWX8NWYANWH8NWYANWX8NWIANWYAMWn8OWYANWX8NWYANWX8NWYANWX8NWYANWYANWX8NWYANWX8NWYANWX8NWX8MWn8NWX8NWYANWX8NWYANWX8NWX4NWX/////m88n2AAAAlnRSTlMAAQIDBAYHCAoLDA4PEBESExQXGBobHB0eHyAhIiMkJigrLC0uLzAyMzQ2Nzs8P0BERkdRUlNXWlxdXmBjZGVnaWprbXFyc3R1dnl6e3t9f4CCg4SHiYqMjpCTlZaXmZ2goaKjpKWqq6y1tre6vr/DxMfIzM/Q1NbX2drb3N3e4OHi4+Tn6Onq7O3u7/Dx8/X3+vv8/f6/1q+aAAAAAWJLR0SX5m4brwAAAkhJREFUSMet1ulb00AQB+BfoYgXFkXE2yKgiLeiiAdVvK2oiFrUetSrIngDSgUBUStVpAUyf68fJpvsNtkk5XE+ZXefN7vdTGcXkKPjoz46oI3INOnj92qte0BekdSx+jlPN9+kcQPkHa/d2RHyi1Y3tuSLr/ta6eK6yD/iTlYzE8D9XetwTyhIpIpZ80IgZ+xWWegdBYv3IcW1Fw3PamG7zJZOqoO5Xd06N7Vccj3qWLYJuC0an4tgj83Wq8vKNgDAHW70V15QXX6T5V4qAz8beKuSzICLKkwLtl/p/rFd7PFDZg54gMfLhxRWby2j7Fm/mZCXFDccBgDElO3axu8CAITPrTRfcU2BMQCoyko937YCAFZ9OM38fMSEl2U3HQHQK3VMbuEcH6aFUyasNsvKdRn2AtGC3RzfDACoHSESMHz1z0knLETxym5NMKv5xCl8hmd8avCacUOCA+iznsc28GyZBLfFjM/NBxn22escrTPZrQpSYHnKAQtRa18y6wSDcAKWPRKwy94XrPhORDRSa/62BGxHBhf30D2jkyFnTrbK+u7pap4t3yY7mm8DgNDxghEDABzKWd/dzLOZuwd3Hh0losGze6WNm4vvaO4cJCIj0dJ44g0REQ1xNmGPQSXFPpHA6ZLYCyvx62ZLYPmN9h/+ZgmuW65LE4HZ1DKvOqiPY2rdfbu4uhu4zrcUHxCpQO6x4zxas8hzDPEA7orLeVuR8WVjbuc0Wn3d4f96D/G99zTqLkxJT3dff6/75cFy+ntdCffIfzIU1LzRvMcmAAAAAElFTkSuQmCC`
    },
    mac_o_s:{
        name: "MacOS",
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAAFJCAMAAADKY5SZAAAAolBMVEUAAAAzMzMtLS0zMzMzMzMzMzMwMDA2NjYzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMyMjIzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM2NjZvYwsaAAAANHRSTlMA+gXb9VoKDkXw1inj0Mx0Z1PrNce1l7BNEX4ViG4t3zGhYDp5JKY/uxwZwyCrjb+SnIPnDrdMBAAAHBZJREFUeNrsnQd3olAQheeNqGDBAujaYondGHR98///2u4DESOuawGpN+ekkEn7cu/MPGOOkCnhwpOuXsv0Xz3AKWN6DxfszTQ5P+h+t+ZtwzQ3qq6rprlsb8et/rTekEdfHbc4I3rNibjSGoPdVs8pjNMNcdYsmfN+Xf7oZTxPcgisFvWdUVL4kRXn7IY4d+qa6vZ3XjsCTS9Nx0hreTqv2hAdgvy23DIb6GGzr392UorTwTjLt1TlDCJ/TGdA+cHs/1qBUIrCjog2xn2JnyjyF3QCKun9X730mNP6KYtyX5cERg/El4AKnE2jpmEKaKJ41svPh9zB6K9smry6kwtJpomIFse2ctWOPptzuE8sTetn6jS2it0ceXByae4WCAAJg2mBXLQqRIFh9PIkomq3nCyYKHbwWpUTBc3R2ziZkS8khaZtyLn0LkN6aVb6syR0TUSA4kQPhaMLk7fluMNEBFh1hwIkD1GCpj4pxDjmAmS5pTzRIQOBmasVYwoTAeBjzIiHD9IZ6M1uJ4YxRxQgeVRAOl2z2e3FzZki2ntOPDIcbQmY01jFHAHWOxY5kMeYVwax2TMRoDBVohTtS5ilRixaJiJAfhhVkA5MU4u+MRFAM4kiy9GByVsRnz8IUGzxCOyR98yfQZRZimwfojhtrm9GemRTjgAzIx4gnZT3MZLjBwEGLOJN0pPynBw9YwpLbuJjSQcmUQsjxtKyZAzGzTVjLiJlTIR1jLrkpTH70WGJAA0lVl3ywphqOSIsEWAX9aX8P8ZkkygYExFmakzDfWbMffjTR4Q7XivQP3bMUtghR4DvmFvyFPJGqCFHKC4TQVKEPNRJjvAxjH24z1gahbBYJqJN/gh56SsUlghQS0i4XZbKIgSWCNBKGEnBkk/g3UJAI4Zn7jsa5vTNwwehoyapTZ6z3L2VJcIql0iSVsi3b2SJUD6QxBMqRsu3sUQYKcklKVhu8D0sET6lpKbbYakGu6y7JBO1mF9nWS0Gz1KQTNo6efXg42GZefJpXwaccYRRKkha/TLQ2YNQju8fcR6f4xAcS4RVMy0kBUsjMJYInWGS90kvy3lALBEwmefuGyx3gaBEACNdJAXLWjC23KeN5F9R3n+WCNMUkmScfwL6TTKfuNvM7xEjZQXoL8kRTyNJ69iDgL6uQZUUxtuSRFt/h7eZVpLCl11A/1Du0kvyr+gXoG8jJ9UkGZe+AP0hWU7BLZS3xEgFQD9IYinVpuS+nSAxlaccD8s8YNYofWqXL2/qCF9SuhulY0sTXlSqN0pXx+0yuxHDn4hzDfC1o3cmx5bV1w6MemZKl2UfMIu3T/oEfPqYk9Jb1m5EHLPpHeoUR6hnJC+mOCsDPkNyrfBMF7Y0njPlODOlL2dxhAXxTB6UlQI8rpTdFeOB5TKbOb7oiclTbGYr5XVbbh81ZT8z5T9EMuAjJGcS91nM0sUb3gJ24zO4FXcUBSVGetiLEFlPlhjjJCReEfJe80pcJnJLbhYF+eAK9kIUjbu1MEbEcqpebXLizL3GK1VdHTISFz0SoKWcvlya1QN3Szyf2C7alBQiCggmoxI8oK3fpqSKNtI0rWyQRLSpl8V21pN3EjH7uyO1NiqKaVeeLMnzxRknZZyfFUCopw2WXJR4i5qthl2EK/l7SBQUyzrgvabUuL9yf5NjomYDTloZxMR7Dw1wJecuGDBi3TWca7T1GJORUuvAmQqTIfFAREMEvBNl2+/fJ6NcARELMKbSGgARnQcMbBFjtOn8uIYC8PkH619wLDi9bBwN7Ra1ewD4owgD+ud/RgPAkEwpUP5h70y41AaBOB4wHlHXa6Nr1vXYeq+rVgvf/6u1BPGfSNYjC2pb572+Vooh/OQYhmGg4aOXJHBoKMpOP+PyVEcscQFOkVPFVIoMFNXzYiz5WyzT7jk1wyzRMBx6/UYJlEJesk6OqnLk5jBrCLqqcG3HmEjS8g8k50wZMBG+RabIgwRL44LR8gaNEijr4q9Ou1ZrB6rey+ofLg6d1rrZwR7BVv6aMd+nj1rr5WUzGihoKw7cyz3J5+rP1jbbUZ9b3EqzLJ7XKCecWEGpojy1XP5HvBWViOZi5u6WRRrzn3cExi7a247kq8tDYS8fIgX2VDFtBbvvTX2pWLqtvMxE+xZYQre8rt8aUMq+2+fy4kW+wMtMOGNhGpOrsv1oCfPBRH5NZOoH+M1Vf8uFKV3Omco0lixrdlBWToFEv7HWKovqQJor3MPUgt8lu7RGgLfAO4NImKkVoSQ1LZXAyD5TXx5DDhpWWJ6zEu80mD2U1HnlWN27H/uNTWSsSirdEAAMMTHHxF9/KME4TfjIodoGqcvfpG60tIOyeRwl6mADpRy6ool1ieCNE6TNDvznvCchxbgS2QtRDtTHsUPR4TGAyrraMrye9nspWkVZ51oLxLiIuREoYZ+IyjBE2VMa/F6Dikt3WCgUhq+W9KHWcZTUaRsnCZSwOAGl9CpGTjnEASUMctHbwYFSueTq/Qk/gg0hvPFxlCW1dCQUKnoSykwUZRkoISE/JYy4z0AJfTmFEmdl9QhNKCr3gZIwYYJbTFav3R/1wrA3/pBNvIfJVNSqcmWUlUv2Ie4CpdA2193nfEIgUkwAQvW/dlhSPnXo1yRzmbtDSRhfPsvXg8RR9sJPncZ1URL+fgxlOzZI3wNKwty6wog3vQeUjHkd52uZ8LsbK8UUQ2HyofnO52AaxFAOHHr9E60n7EMfHrszlMJusLtJuVdbTZp+sey5cpRSKNUnWrw6yrUhjwz7KKWxksqNuxnj0BOHQAkrzUx7e7vbuEc9Ndb3h/KHVL+nhDMCJT2uV26x/owK2FsRtfhP9iNIAdL2WFlSxyxdgkxuKYayKV+/wA4ks/Z9f/HELIlcstJElFUeZ3lzlIQ3goR9efEwoGSsESSbD6QOVbDWLImc8ZJkfX8o+3kZnhAZ0KMlSliY5HeQ68n2KQ/08NN+QrdH2eiooQeWX5EFypDs4erpbmSNVFezkUWUi68slXc4VvaUu4hLCAlnHu7KXoUOvrcd5vz95MT4Sn6zxKxKyUmS5v2h3M/gwULOxJzzhTD0AiUmHvG9lpq23ar90+zKPKQfiGjcI8q12pTt+h5hpL+si9ZXAkqsO8Jsg7d1MfP0Up2rILDMnkijvyYwcENuj1JEU1GrHeej1BvnBUhnNIrN4Ij3Ran4/7xyLsgdtc9YW4cnbr7fHCXh5UCyVP0ol3OGvAuUyujxh6WCufuL5hzq2yQJ7SEutHiPKIVOE4CjwOMUXF5TKPEskgVvBXP8ZKtOKHfj0HNOft8BStEu207EzEa3jMVQwqxZivto5UZXCIXPi1dVhUKUTiLKUOIocyIpakXnvFlXNvTPaoaLWUbXcwjhZNIO9hV6fitfI7ah3EiOCnbeLYlb8SuViu/FEst+RYgbe7Uwyc9EUhjnjVnrtbp9rxDpF90PH1ZkSpBv3Rp1a9XVS4bJnHYl0WiZK3NmVXgoZyRyPZGQiEu/ngf5YvuS7BpC+ET3BLQsJJQzEpGmpxItk54POa8hcFvFUPk48pQOJSODA5TLB8pUota2EFp8HFlOi7J14JXxaJOpUfpxlNlHo0w9WHrzx0FbQxJzAP4P7zQwJWr9i7up/9lrGa2L9B16RPM1g7ISc7t6zDrfEK/zCGNnRmIe/o/oTOklfrTsEabyOxKPPZT/by/bMINyuUf5WDaamsKpU3hM4N8ReVBQovxxvf5NYiKK/RuLiAlcVnGQ3bLIevGoyMS/qohEKSiU9nWh/fYMI41MZd18+SMzv1h2ZaKZuhJVhtd/WogimutKsUFQgjWB9dd2TF/JkZWbq1qh1MlhaRCMh9ntsshM7GqFGN2n92p7MM9j969TKnRbvmtx3wwxgDV3WSscvaZ2HgxESz/e+2FP/F4Z/U3900mWeftnBhHIzErsFG7QYNaEEM69ZT1wYp4T2qdcoVUWdU1dRmNTkE/Si9ilTzcNS1vjhL/sLy+xGn+tWJ0j4FKyhP+Xz65ZKpiijG4gH3O0hE43w+2cdvft7YGjkpUsjdTxBM3py+XthjBeRBknSsjVLHi/yHgA1IqGjkpmsmgsZ8Ecri9rN8KfugqQp0vIvzHDDRPBeSzd8ySD0qGSZ4nImv11QcMkjM8+UcZZMJ+fTI+YhHmfDjXvmYFK+j0cELoAZvB+bh8U2UYo4+wSNoY7OZHubDJgDbFAcqsqeTHM7Jl+kYS7hVS/VtckS/hvm707FJVspyCpOuEYiu7xIark0FQF1JlJlvL+UTvnMQjvj48MYHQnR66OPLaZDJKfySRpVJILaJtlKTzSLbheKf/xryjqn/Rcx7ZI0PAT2ySlRxKsuKPABct4QBzCK3A5TKgUDebj0nge0F1qIstTXYXAHKOV8DGsd1+3b9tRrf7cSaBpfILASag1J2bbpE5SHakZdjfr4i/PJa7XyCzeRwVZ1UvbZfJJzXBFk908eRHf34b/s51HEXYcUuCg4XNikmQ/SG4uQXZSZvB7lvX1mrV5Uk3p8boSvkgqYjrx5POJFFnKr9ZAK4GajOMH01DFZFtnbikRTGn169BwuLPTupOpzvJkMIzDUgTINQqIFcLZshQpwvjeAfYcDR0UwmSmgxy/ky+W12FNZ4B51h2xhK80MrmNblqClkteUYK5LWu8jlGU+H10kq8ExsJkmO9Bwvfq/Cs03lwLgZYBSF1cxmdqLwu7g8ZQmm+V2MeM1/JJA6k3m4am0yPo8clGSZ2Be2LGJzyjhfZbGKk4nKgNoiSM9XQeWXLG8wnnW0fvtElx1hCzAhnHHicnSyjmD76VvWOUSRcdjtDxTjTMCVgecbHTp296XhVw313UK+U+UYpDoRrKN5A8p6r0aLh7XadEBOHToscU2JhC+dP0WInZG5U8zziIPRJ6+uiGFmd37p7Z8D0MlwbCCViZdrDFoelu7FxBR4Ekm614H8spLAIvqDLULQShM4PSN4Wyfdimni8ywOAc65EWpwWsOK8tYOcAYiwSK+FbRMa30ihTRa7A3IxmmTAypQuAhvgMRv1SMN3ODD0ve0hhw112meDiaAT8JGiWMB6kiZqN+Azm7EN4I2OXwiCmQ3pfw2R9Cq8XtQ5eemoY26wRyR0Zy1OMSwauMtEYpFaycClM8jSLXpo2LJ8bd7eZGkKZNXYnDe7OTh9YFH1QX/Jo01tqlKw2bReUtIdVAyChBZo44KhPq+kDxsJ+pt+1ApSp1388LsyI8MIO5cgIyq6RBS6mBjxpyPXulD5YBYn924TIMK/mQvyK/m3E7KIuj4FQ6FRJvxpuerqBwNwNs2Bq0ZXK9HHldGUHg3nymkVdfcRuJriaw8z99Hr10vspEF45YgLGORktCPmthKgbp6iRaJm8YKDTnTRXQI3Xt2luIPq64sNA9/A631LP9SXtsV0YpXpCVpzcAKauveTSW0B1YywUGGNPcw5HC0zhEZa36+OIgGXAPgILg4FHYsWjdWC8uiY/3NvAxFaTGU8XLIux7/oNgQ0Z6gCJov7N3tW2pREDweY43sGCCgq0gigqiK9k//9fayuto52DCzeRts/T/YTV3nKTTbK7md0cIoULlXe2TzDZO4sVOV7g3eS2B/AHuA8xu0tIPtZ63vz+10yMvNymH+fScZJXFIXSMZizcSWTfX30dGjmvdsvnvA4dB+dr9O9E6EcV7ck2pCGYjAH05O6me0VzR+GlFAQG9OKFHGzvFT6bCO5clF+aniz/c31twetczFacHb+G0tsJUJpta15NFwqko1mMumcl/yerNPZQ7Tu07xNnEl9i8gjYJLuuq5wK7M4OetcreH8WPNEKkunbcIbQKwjf7shPZD/hLAkZnYy+Qnnx6EJfwKxSWwj0h7Yz09JGvH8CFDA+XFoIhUdJWOJh8V4HpI/20ka9ggst5tn5WJ47D/Mg3ezN1Bee0Vol1Dz8uwSzOvZ6/0oD0xM9ublgY9vmnBy8U0VFRTsPMtQHhNxPPPP6rjuIADOi37MknAMezQ/EGcbkdZeyv4mm6r/nbeTZgCY8OC/Nix2lRJ4s/JRODe0FoN6yu4mP5iQ2X/ozD3OA8DEfSfTUsw1E6d2cIE1q9wjlGyY6WMTkzgAzM9p3Fk++fSb3/ZPWqX/WRVwcloBmrlgzk/iGSbyBVjW/8W1EpZppfvryhqqkEWz4+ORxntcw/JX7eC3OTs4r5nmS0/dBXzz7ZY5iUFD58BMrwmP71f28v1Knudm9dsvp6NtVb0YnFjNlRCeRElZWjd2tHPF0Q4Lo7mG87m2IDgJy0EULB2SlTF6DXEM3pVj8MeCtCAH65zTZI982yKCCZUMybmRSIEoykkKHasDzvvTBaEZg4vDDrq+WCJfSfPxz6aa3K/J/jA8ApqRy+t5qQShu6BwFn0gZ9GvxX0McPr28xlVnEfr64dSIJXChJR8zCIO591SnzPY2P1NNwGY8prObw4R6yTWF3S9E8T0+vNw4iig2ZgCy1hDzou67gs6n861h+W4lUnhTRHh0MERwITXJpol4jwikxQVrG06kQ1Utoh+i3PmcYCBB9e9IKiwiUXDR+GK/hWxLcrDzJZ5R1gKB4R0BkU0ZeWROhOdI4h4bHlUSUfKLnJZp06Zgs+vJzSQ4o9/4XaKEY/gplP5KeUEi0m6iPIVOXhitmZUKxoJKxERPdUyVHzHSN4vF64snY8FZSOWl85nEXrAg1BUn+GcrIzc9pVvmX9QXvpwRFDKtzFzV5wzX0jYHeCukNqU5Btq5fkddw/HleM6D+nwPbnyXYsc7bYNEPjUVQ1pWhKhFgoRlOgQcJqJ/X213hMVA7r5WKtKUIIcKC1wenzLQSi/bbt//kaeVj5UEOlpiwc703oCj8/CxbQLjJKdNMSUQuIEJ3oymQLRMkSnmAICNdeEXZHTvkiNJomQOIFVCks6ndVHzbQ5a1V/H5hCj+lkjwgiIW19T8HgE7x/CiTUbsJ8iKBGj0CKexUhlZkUbcCDHVwqSuQ1naHUXEs2+OMdCrU5kcHXdVKPjuB2FeDAFutRFO5Uhn+xoEgCjbrM7YQkN9Bqbg/W0Hs1/DvqER5oFCwYJV9A2CxB66L3DHNO2YWGC1J89J2VhDWIwjuGMl4g1SEkyhaCJYgEvFJyRiIpnLN2NuW8qvyuEL0mHpv4gPs8h2LpvPUx0LR9kzsHFZNQ009xZiRXCK+yIx2d08b8FHjq3tIgJOF8UyE4BRl0BuuCkGzBZ83vQRbqRUOi9qGwC8byqBVAsnXmyhl0s8zjsfqIfDgf1KC2js1ftRu3zIdyR0eNl3XGsnplltuB+oBekwp4mdEIR71OGvjIsQUVGrcJtXgsfHIUQwcyG92xmXNu85F/itucAk7HDnlJXvQwXBt09PC/dKbCWRCU1ZYvJNjZGMvksoUyWKJOpP15FpJHASl7qJiOUXzHFmmrDlQU32Lh6LPEJng5768z75Codl5K4/xrvnb9wcwaz8tMQs8AMd0W7js0VL42jMdrraQ1HECHRISE/hAZSBx/q882dBA4Gj7U7b249n0tyb4QJ6FEAwUDZPu1p9avdDAuNrG0V64CSNlkcJsoi0gfYu8SPDm6Vaj2td87bozH49LBzdPl6fL1V4QLe5TsELGG6vXlSeP1wh3vWg+P3UWWjorCp4WfkiMiPfLltoZKZmECPr1+xie6bSdwSWYFo7Nadzqdlk8vlpX3mqVOCjDKYCR1+kdrxsoAIn/k2U02GXpERQ8lJTo5brIDlJWxiGX9Gq8QLnBt+D156Se6Dl2Zt22sbounfM9zkYzId3Lm4XsEC65zQpCzDctpcRWD4slzVNIHis4NPa+QYQYieemhPC9orxTSMCk869ipZdFJL1RGWewW1eZDcF7OeqOw4dIrHPkYL1x6OpZ2vtj5JuZk6Mzt8F7TUA3Yg5Y9UyoYvoYjieNCFUtv6bC62/3gZdS9B6q4mex2BXl1KFSDgwoXKihElsFcXcJBzsOxMm1b8GuCYn4FMHNVDD6vzEs+cy3UKLmMSZ7l9f7FllpD/Ko5LFkBe1kX1ifQsEXF5H5lopd3twXJ+DlgLtQ+GE7eOnyf+Idl58YRkOFgWuPLRZKpAT81P996qZ8Lt3tliU/V4HquRr872/Al5rXn4xQJsqIaSk/l5iaPfNZ9bHtFBRMywgVH0LHQNFc6+dKpTZajyst0rAzmzevy8KqdIjUmavCl3v1PDS/ppupodnTaue+VnAk45hzYhicu48Jp5tNVqdE+PmiUWnVnBhgjazj4rmF8mPp4KjgjJMQ8oiCFuBb8U2wNqgo9zskv1tMlg/38b2gAsyNUmAfyX9YCKkOxJE37P5bf2rvT5kSBIAzANOKFiYl4BEU8UNDEeKb7//+1rYKszZYmtQmIc9DfUomp8ql3emQchrgyDG/eRFJWImmbv6TkBfUylkl1Y8lMtS4tf/vh/PI4ntKSj03IZukSal683pvVcqx9LHlpLWvt9bbkrXPZY+lp3S6zNsqLfYjaWibPw8vP0tc2lnz6bl6WR20teUdNXrXR05JPj8ovlsOpjpZ8+12eli1Lv6mHn5CUr2VDu2kcaDpkyTwtA82uIHkv+LUqF9z+t77bvV9ejf9Y0mXJ3Ck1+ngJFw8pztsy0sQS8OLGgdwtt1pYApJ/O0m+C8RC1QuQljeUZEvlc3lrSbZ8UdwS8Ksvxcp+KVyfTFnOCZTFBKTg9pJseVDWEhA7RUiy5YjUXNsAggZLFlPPSloCObOiJU3DRfUmHyD7tThJtuwq95Uu0L5WpCRbvqm1+RKQjkaxkmxpbhVqmID0VLwkT+QnZSyBLPcekmzZsdQY5EB2eB9IxmzZClgCUmTeTZIb5lz6QQ6EvnFPSb7pH6QOJgBNuwJIxvcHTx4lviQHpKgmAuR5eUPWYAJZgRCRPFu6H1IGE5A2oWEKIxkP8mEkXzABCJcCRfIczKoj2VQOSL2ZcJIxpjeXKphA8CQi5GfHrMgSTACifiioZNwxzTFKgQlIH1VDqPnmMpiTNQk/lwMQHurCRpIxO6KPciDqCzndXFrWlhahqMkEQLI7Qo/tfzDfBiBmMgGQHN+QIJKM2YpEnH8AqXkSvkleYHZfRMMEJGv3KhekkbSixQuK0zMhgZSkSV45VH4rCCYAkTOWE/Iv5uTYvP/nTECiytKTFvJ8HuxoSndqmgzZC2rS9chrmLWgl+GEucwdkiBqGFInMo1pLI4OFd41IYasjN7VgDw3Te95g4Vqxo7NrWuq48jRnJ1suv0cxI64918lurD5Gaa5Okzp1n0TEsf2cqLQwL6mWWscKsiaN2Ek6I1mhrqQqWwuThuLw5m3o9P3W6o7pjSNMJhXkDlzi2N753p6OKY1a10/Sjgxw1myfLwvPA6qoaGTY1rTMCfBoOcgMSj8xBAAk9c+rMfue/If9XKMi9+1t/IH+ykQpUXhG0E2JLTs/i6Y1TVmTHPGVW+5/qH/6CB9VlqOcfnX8NDejp8bYc3QcFBzff3oN6/VqD7tonW78mEBw50T23ywe/352O8swuH59Xqn8StP/rn+Fk4Wq4bbqcbVcRurbuvdq5vpPyoVvye9zlMKZmTlEt7vDxfhJe6aAF00AAAAAElFTkSuQmCC`
    }
  };

  const container = document.getElementById('rainyun_goods');
  if (!container) return;

  new Vue({
    el: '#rainyun_goods',

    data() {
      return {
        // 商品ID
        productId: null,

        // 产品信息
        productInfo: {},

        // ===== 系统盘配置 =====
        diskSellingList: [],
        selectedDiskType: '',
        diskSize: 0,
        diskTypeMap: {
          'chdd': { label: '系统机械', maxSize: 250},
          'ssd': { label: '高速NVME', maxSize: 250},
          'hdd': { label: '机械盘', maxSize: 1000},
          'cloud-hdd': { label: '高效云盘', maxSize: 1000},
          'cloud-ssd': { label: 'SSD云盘', maxSize: 200}
        },

        // ===== 公网IP =====
        ipTypeMap: {},
        selectedIpType: '',
        ipCount: 1,
        zoneList: [],
        selectedZone: '',

        useNat: false,       

        osList: [],
        selectedOsId: null,
        expandedGroup: '', 

        durations: [
          { months: 1,  label: '1个月', discount: 1,    badge: '' },
          { months: 3,  label: '3个月', discount: 0.9,  badge: '9折' },
          { months: 6,  label: '半年付', discount: 0.8,  badge: '8折' },
          { months: 12, label: '年付',   discount: 0.7,  badge: '7折' },
        ],
        selectedDuration: null, // 当前选中的周期对象
        cycleDropdownOpen: false, // 周期下拉是否展开

        // ===== 优惠码 =====
        promoCodeInput: '',
        appliedPromoCode: '',   // 已应用的优惠码
        promoCodeDiscount: 0,   // 优惠码抵扣金额
        isApplyingPromo: false, // 优惠码loading

        // ===== 价格 =====
        totalPrice: 0,
        originalPrice: 0,
        currencySymbol: '¥',
        showInfo: [], // 价格预览明细

        // ===== UI状态 =====
        loading: false
      };
    },

    computed: {
      // 当前周期显示
      currentCycleLabel() {
        return this.selectedDuration ? this.selectedDuration.label : '—';
      },
      // 当前IP单价
      ipPricePerUnit() {
        const prices = this.productInfo.ip_prices || {};
        return prices[this.selectedIpType] || 0;
      },

      // 是否显示原价（有折扣时）
      showOriginalPrice() {
        return this.originalPrice > 0 && this.totalPrice < this.originalPrice;
      },

      // IP类型选项
      ipTypeOptions() {
        const selling = this.productInfo.ip_selling || [];
        const map = this.ipTypeMap || {};
        const result = {};
        selling.forEach(key => {
          result[key] = map[key] || key;
        });
        return result;
      },

      // 当前 region 是否支持 NAT 模式
      showNatOption() {
        const region = this.productInfo.region || '';
        return natConfig.hasOwnProperty(region);
      },

      // 当前 region 是否默认开启 NAT
      isNatDefault() {
        const region = this.productInfo.region || '';
        return natConfig[region] === true;
      },

      // 当前 region 是否支持试用
      showTrialButton() {
        const region = this.productInfo.region || '';
        return !noTrialRegions.includes(region);
      },

      // 磁盘类型选项（用于下拉选择框，无 disk_size 的项禁用且标注"购买后可附加"）
      diskTypeOptions() {
        const selling = this.diskSellingList || [];
        const map = this.diskTypeMap || {};
        const diskSize = this.productInfo.disk_size || {};
        return selling
          .filter(key => key)
          .map(key => {
            const meta = map[key] || {};
            const hasDiskSize = diskSize[key] !== undefined && diskSize[key] !== null;
            return {
              value: key,
              label: meta.label || key,
              disabled: !hasDiskSize
            };
          });
      },

      // 当前选中磁盘类型的完整配置信息
      currentDiskMeta() {
        if (!this.selectedDiskType) return null;
        const meta = this.diskTypeMap[this.selectedDiskType] || {};
        const diskSize = this.productInfo.disk_size || {};
        const diskPrice = this.productInfo.disk_price || {};
        // 价格和默认容量只从产品信息中取，不 fallback 到 diskTypeMap
        const defaultSize = diskSize[this.selectedDiskType] || 0;
        return {
          label: meta.label || this.selectedDiskType,
          maxSize: meta.maxSize || 1000,
          minSize: defaultSize,
          defaultSize: defaultSize,
          pricePerGB: diskPrice[this.selectedDiskType] || 0,
          step: 10
        };
      },

      // 所有可售磁盘类型的汇总提示文字（根据 disk_selling 固定生成）
      diskSummaryText() {
        const selling = this.diskSellingList || [];
        const map = this.diskTypeMap || {};
        const diskPrice = this.productInfo.disk_price || {};

        const parts = selling
          .filter(key => key)
          .map(key => {
            const meta = map[key] || {};
            const label = meta.label || key;
            const price = diskPrice[key] || 0;
            const maxSize = meta.maxSize || 1000;
            return `${label}${price}元/g/月（最高${maxSize}G）`;
          });

        return `购买后可随时弹性增减，支持多盘，${parts.join('，')}，开启备份支持0.1元/g/月`;
      },

      // 过滤后的操作系统列表（平铺，用于默认选中逻辑）
      filteredOsList() {
        const region = this.productInfo.region || '';
        return this.osList.filter(os => {
          return os.region === region &&
                 os.is_available === true &&
                 !os.name.toLowerCase().includes('gpu') &&
                 !os.name.toLowerCase().includes('btpanel');
        });
      },

      // 按 icon 分组后的操作系统列表（用于渲染）
      osGroups() {
        const logoOrder = {
          debian: 1,
          ubuntu: 2,
          centos: 3,
          windows: 4,
          rocky_linux: 5,
          alpine_linux: 6,
          mac_o_s: 7
        };

        // 按 icon 分组
        const grouped = this.filteredOsList.reduce((acc, item) => {
          const icon = item.icon || 'unknown';
          if (!acc[icon]) acc[icon] = [];
          acc[icon].push(item);
          return acc;
        }, {});

        // 组内按 order 排序
        Object.values(grouped).forEach(items => {
          items.sort((a, b) => (a.order || 0) - (b.order || 0));
        });

        // 转数组并按 logoOrder 排序
        const result = Object.entries(grouped).map(([icon, items]) => ({
          icon,
          items,
          osInfo: osInfoMap[icon] || { name: icon, logo: 'data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' }
        }));

        result.sort((a, b) => {
          const orderA = logoOrder[a.icon] || Infinity;
          const orderB = logoOrder[b.icon] || Infinity;
          return orderA - orderB;
        });

        return result;
      }
    },

    watch: {
      // NAT模式变化时重新计算价格
      useNat() {
        this.calcTotalPrice();
      },
      // 当IP类型变化时重新计算价格
      selectedIpType() {
        this.calcTotalPrice();
      },
      selectedDuration() {
        this.calcTotalPrice();
      },
      // 当磁盘类型或大小变化时重新计算价格
      selectedDiskType() {
        // 切换磁盘类型时重置为默认大小（只从产品信息中取）
        const diskSize = this.productInfo.disk_size || {};
        this.diskSize = diskSize[this.selectedDiskType] || 0;
        this.calcTotalPrice();
      },
      diskSize() {
        this.calcTotalPrice();
      },
      selectedOsId() {
        this.calcTotalPrice();
      }
    },

    created() {
      // 获取URL参数
      const params = new URLSearchParams(window.location.search);
      this.productId = params.get('id');
      if (!this.productId) {
        console.error('缺少商品ID参数');
        return;
      }

      // 获取通用配置
      const common = JSON.parse(localStorage.getItem('common_set_before') || '{}');
      this.currencySymbol = common.currency_prefix || '¥';

      // 默认选中第一个周期
      this.selectedDuration = this.durations[0];

      // 点击页面其他区域关闭周期下拉
      document.addEventListener('click', (e) => {
        if (this.cycleDropdownOpen) {
          const el = this.$el?.querySelector('.ry-cycle-dropdown');
          if (el && !el.contains(e.target)) {
            this.cycleDropdownOpen = false;
          }
        }
      });

      // 加载数据
      this.loadProductData();
    },

    methods: {
      // ============================================================
      // 数据加载
      // ============================================================
      async loadProductData() {
        this.loading = true;
        try {
          const [productRes, ipMapRes, zoneRes, osRes] = await Promise.all([
            getProductInfo(this.productId),
            getIpTypeMap(this.productId),
            getZoneList(this.productId),
            getOsTemplates(this.productId)
          ]);

          this.productInfo = productRes.data.data || {};
          // 设置页面标题
          const productName = this.productInfo.chinese || this.productInfo.name || '';
          const websiteName = (JSON.parse(localStorage.getItem('common_set_before') || '{}')).website_name || '';
          document.title = websiteName + '-' + (productName || '产品订购');
          this.ipTypeMap = ipMapRes.data.data || {};
          this.zoneList = zoneRes.data.data || [];
          this.osList = osRes.data.data || [];

          // 初始化磁盘配置
          this.initDiskConfigs();

          // 初始化 NAT 模式（根据 region 默认值）
          if (this.showNatOption && this.isNatDefault) {
            this.useNat = true;
          }

          // 初始化IP类型
          const ipSelling = this.productInfo.ip_selling || [];
          if (ipSelling.length > 0 && ipSelling[0]) {
            this.selectedIpType = ipSelling[0];
          }

          // 默认选中第一个OS（按 osGroups 排序后的第一个）
          const osGroups = this.osGroups;
          if (osGroups.length > 0 && osGroups[0].items.length > 0) {
            this.selectedOsId = osGroups[0].items[0].id;
          }

          // 计算价格
          this.$nextTick(() => {
            this.calcTotalPrice();
          });

        } catch (err) {
          console.error('加载数据失败:', err);
        } finally {
          this.loading = false;
        }
      },

      // ============================================================
      // 磁盘配置
      // ============================================================
      initDiskConfigs() {
        const diskSelling = this.productInfo.disk_selling || [];
        const diskSize = this.productInfo.disk_size || {};

        this.diskSellingList = diskSelling;

        // 只从有 disk_size 配置（即购买时可选择）的类型中选第一个作为默认
        const enabledType = diskSelling.find(type => diskSize[type] !== undefined && diskSize[type] !== null);
        if (enabledType) {
          this.selectedDiskType = enabledType;
          this.diskSize = diskSize[enabledType] || 0;
        }
      },

      adjustDiskSize(delta) {
        const meta = this.currentDiskMeta;
        if (!meta) return;
        const newSize = this.diskSize + delta;
        if (newSize < meta.minSize || newSize > meta.maxSize) return;
        this.diskSize = newSize;
      },

      // ============================================================
      // NAT / 公网IP
      // ============================================================
      selectCycle(d) {
        this.selectedDuration = d;
        this.cycleDropdownOpen = false;
      },
      // 根据周期计算总价（基于当前 totalPrice 按比例换算）
      calcCyclePrice(d) {
        if (!this.selectedDuration || !this.totalPrice) return '0.00';
        // 当前总价 / 当前周期月数 / 当前折扣 * 目标月数 * 目标折扣
        const baseMonthly = this.totalPrice / this.selectedDuration.months / this.selectedDuration.discount;
        const price = baseMonthly * d.months * d.discount;
        return price.toFixed(2);
      },
      onNatModeChange(newVal) {
        // 当从独立IP切换到NAT时弹出确认框
        if (newVal === true) {
          Swal.fire({
            title: '警告',
            html: '您选择了NAT模式，这是一个特殊的网络模式，该模式无法直接开放外网80,443等端口供网站直接访问，需要手动对外映射端口进行访问，不推荐建站使用（如果需要开设高性能消耗的游戏服，推荐使用游戏云产品哦）您确定选择NAT模式吗？',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '改回弹性公网IP模式',
            cancelButtonText: '依然使用NAT模式',
            reverseButtons: false
          }).then((result) => {
            if (result.isConfirmed) {
              // 用户点击了"改回弹性公网IP模式" → 不切换NAT
              this.useNat = false;
            } else {
              // 用户点击了"依然使用NAT模式" → 保持NAT
              this.useNat = true;
            }
          });
        } else {
          this.useNat = false;
        }
      },

      onIpTypeChange() {
        // IP类型变化时重置数量为1
        this.ipCount = 1;
      },

      adjustIpCount(delta) {
        const newCount = this.ipCount + delta;
        if (newCount < 1 || newCount > 3) return;
        this.ipCount = newCount;
      },

      onZoneChange() {
      },

      // ============================================================
      // 操作系统
      // ============================================================
      selectOs(os) {
        this.selectedOsId = os.id;
        // 选中后收起分组
        this.expandedGroup = '';
      },

      toggleGroup(icon) {
        this.expandedGroup = this.expandedGroup === icon ? '' : icon;
      },

      // 获取某分组当前选中的版本名称
      getSelectedVersionName(group) {
        if (this.selectedOsId === null) return '请选择版本';
        const found = group.items.find(os => os.id === this.selectedOsId);
        return found ? (found.chinese_name || found.name) : '请选择版本';
      },


      // ============================================================
      // 价格计算（调后端API）
      // ============================================================
      async calcTotalPrice() {
        try {
          const params = {
            id: this.productId,
            config_options: this.buildConfigOptions(false),
            qty: 1
          };
          const res = await calcPrice(params);
          if (res.data.status === 200) {
            const data = res.data.data;
            this.totalPrice = data.price_total * 1 || 0;
            this.originalPrice = data.price * 1 || 0;
            this.showInfo = data.preview || [];
          }
        } catch (err) {
          console.error('计算价格失败:', err);
        }
      },

      // ============================================================
      // 试用 - 计算试用价格并弹出确认弹窗
      // ============================================================
      async calcTrialPrice() {
        const params = {
          id: this.productId,
          config_options: this.buildConfigOptions(true),
          qty: 1
        };
        const res = await calcPrice(params);
        if (res.data.status === 200) {
          return res.data.data;
        }
        throw new Error(res.data.msg || '获取试用价格失败');
      },

      async tryNow() {
        this.loading = true;
        try {
          const data = await this.calcTrialPrice();
          const trialPrice = data.price_total * 1 || 0;
          const priceYuan = trialPrice;

          const result = await Swal.fire({
            title: priceYuan + '元试用一天',
            html: '本套餐' + priceYuan + '元可试用一天，<br>试用后续费依然视为新购<br>以下需要注意，试用产品在一天到期后 12 小时内若未进行续费将进行自动回收，且不属于 7 日无理由退订的服务范围',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: '确认试用',
            cancelButtonText: '取消'
          });

          if (result.isConfirmed) {
            // 用户确认试用，跳转到结算页
            const params = this.buildOrderParams();
            params.config_options.try = true;
            sessionStorage.setItem('product_information', JSON.stringify(params));
            location.href = '/cart/settlement.htm?id=' + this.productId;
          }
        } catch (err) {
          console.error('试用失败:', err);
          Swal.fire({ icon: 'error', title: '出错了', text: err.message || '操作失败，请重试' });
        } finally {
          this.loading = false;
        }
      },

      // ============================================================
      // 辅助方法 - 构建配置参数对象
      // ============================================================
      // ============================================================
      // 优惠码
      // ============================================================
      async applyPromoCode() {
        if (!this.promoCodeInput.trim()) {
          Swal.fire({ icon: 'warning', title: '提示', text: '请输入优惠码' });
          return;
        }
        this.isApplyingPromo = true;
        try {
          // 先用系统标准接口校验优惠码并获取折扣金额
          const opts = this.buildConfigOptions(false);
          const promoCodeVal = this.promoCodeInput.trim();
          const promoRes = await apiApplyPromoCode({
            scene: 'new',
            product_id: this.productId,
            amount: this.originalPrice || this.totalPrice || 0,
            billing_cycle_time: (this.selectedDuration?.months || 1) * 30 * 24 * 3600,
            promo_code: promoCodeVal,
            qty: 1
          });
          if (promoRes.data.status === 200) {
            const discount = Number(promoRes.data.data.discount) || 0;
            this.appliedPromoCode = promoCodeVal;
            this.promoCodeDiscount = discount;
            // 优惠码有效后，再通过 calcPrice 拿到完整的折扣后价格
            opts.promo_code = promoCodeVal;
            const priceRes = await calcPrice({ id: this.productId, config_options: opts, qty: 1 });
            if (priceRes.data.status === 200) {
              this.totalPrice = (priceRes.data.data.price_total || 0) * 1;
              this.originalPrice = (priceRes.data.data.price || 0) * 1;
              this.showInfo = priceRes.data.data.preview || [];
            }
            Swal.fire({ icon: 'success', title: '成功', text: '优惠码已应用', timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: 'error', title: '出错了', text: promoRes.data.msg || '优惠码无效' });
          }
        } catch (err) {
          console.error('优惠码验证失败:', err);
          Swal.fire({ icon: 'error', title: '出错了', text: err?.response?.data?.msg || '优惠码验证失败' });
        } finally {
          this.isApplyingPromo = false;
        }
      },

      removePromoCode() {
        this.appliedPromoCode = '';
        this.promoCodeInput = '';
        this.promoCodeDiscount = 0;
        this.calcTotalPrice();
      },

      buildConfigOptions(isTrial) {
        const configOptions = {};

        // 付费周期
        if (this.selectedDuration) {
          configOptions.duration = this.selectedDuration.months;
        }

        // 磁盘配置（前端直接算好 add_disk_size）
        if (this.selectedDiskType) {
          configOptions.disk_type = this.selectedDiskType;
          const defaultSize = (this.productInfo.disk_size || {})[this.selectedDiskType] || 0;
          configOptions.add_disk_size = Math.max(0, this.diskSize - defaultSize);
        }

        // IP配置（NAT模式下传空ip_type和0 ip_count，由后端自动处理）
        if (this.useNat) {
          configOptions.ip_type = "";
          configOptions.ip_count = 0;
        } else {
          configOptions.ip_type = this.selectedIpType;
          configOptions.ip_count = this.ipCount;
        }
        configOptions.zone = this.selectedZone;

        // 操作系统
        configOptions.os_id = this.selectedOsId;

        // 已应用的优惠码
        configOptions.promo_code = this.appliedPromoCode || '';

        // 是否为试用
        configOptions.try = isTrial ? true : false;

        return configOptions;
      },

      // ============================================================
      // 购买操作
      // ============================================================
      buildOrderParams() {
        return {
          product_id: this.productId,
          config_options: this.buildConfigOptions(false),
          qty: 1,
          customfield: {
            promo_code: this.appliedPromoCode || '',
            event_promotion: "",
          }
        };
      },

      async addToCart() {
        this.loading = true;
        try {
          // 先计算价格（后端校验配置有效性）
          const priceParams = {
            id: this.productId,
            config_options: this.buildConfigOptions(false),
            qty: 1
          };
          const priceRes = await calcPrice(priceParams);
          if (priceRes.data.status !== 200) {
            Swal.fire({ icon: 'error', title: '出错了', text: priceRes.data.msg || '配置无效' });
            return;
          }

          // 调用标准购物车接口
          const params = this.buildOrderParams();
          const res = await addToCart(params);
          if (res.data.status === 200) {
            Swal.fire({ icon: 'success', title: '成功', text: res.data.msg || '已加入购物车', timer: 1500, showConfirmButton: false });
            // 更新购物车数量
            const cartRes = await cartList();
            if (cartRes.data?.data?.list) {
              localStorage.setItem('cartNum', 'cartNum-' + cartRes.data.data.list.length);
            }
          } else {
            Swal.fire({ icon: 'error', title: '出错了', text: res.data.msg || '加入购物车失败' });
          }
        } catch (err) {
          console.error('加入购物车失败:', err);
          Swal.fire({ icon: 'error', title: '出错了', text: err.data?.msg || '操作失败，请重试' });
        } finally {
          this.loading = false;
        }
      },

      buyNow() {
        // 先计算价格确保配置有效
        this.loading = true;
        const priceParams = {
          id: this.productId,
          config_options: this.buildConfigOptions(false),
          qty: 1
        };
        calcPrice(priceParams).then(res => {
          if (res.data.status === 200) {
            const params = this.buildOrderParams();
            sessionStorage.setItem('product_information', JSON.stringify(params));
            location.href = `/cart/settlement.htm?id=${this.productId}`;
          } else {
            Swal.fire({ icon: 'error', title: '出错了', text: res.data.msg || '配置无效' });
          }
        }).catch(err => {
          Swal.fire({ icon: 'error', title: '出错了', text: err.data?.msg || '操作失败' });
        }).finally(() => {
          this.loading = false;
        });
      },

      goBack() {
        if (document.referrer) {
          window.location.href = document.referrer;
        } else {
          window.location.href = '/cart/goodsList.htm';
        }
      },

    }
  });

})();