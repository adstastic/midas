var i = 1;
var run = setInterval(function () {
  console.log("line " + i);
  i++;
  if (i == 20) {
    stop();
  }
}, 1000);
function stop() {
  clearInterval(run);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jYXRoL2hvbWVzMi96Y2FwYW11Ly5hdG9tL3BhY2thZ2VzL3NjcmlwdC9leGFtcGxlcy9sb25ncnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLElBQUksR0FBRyxHQUFHLFdBQVcsQ0FBQyxZQUFXO0FBQy9CLFNBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLEdBQUMsRUFBRSxDQUFDO0FBQ0osTUFBSSxDQUFDLElBQUksRUFBRSxFQUFFO0FBQ1gsUUFBSSxFQUFFLENBQUM7R0FDUjtDQUNGLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDVCxTQUFTLElBQUksR0FBRztBQUNkLGVBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwQiIsImZpbGUiOiIvY2F0aC9ob21lczIvemNhcGFtdS8uYXRvbS9wYWNrYWdlcy9zY3JpcHQvZXhhbXBsZXMvbG9uZ3J1bi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBpID0gMTtcbnZhciBydW4gPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coXCJsaW5lIFwiICsgaSk7XG4gIGkrKztcbiAgaWYgKGkgPT0gMjApIHtcbiAgICBzdG9wKCk7XG4gIH1cbn0sIDEwMDApO1xuZnVuY3Rpb24gc3RvcCgpIHtcbiAgY2xlYXJJbnRlcnZhbChydW4pO1xufVxuIl19