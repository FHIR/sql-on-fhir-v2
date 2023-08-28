rm .tests/*
mkdir .tests
for f in tests/*.jsonnet
do
 r=$(echo "$f" | sed "s/jsonnet/json/" | sed "s/tests\//.tests\//")
 echo "* $f > $r"
 jsonnet $f >  $r
done
